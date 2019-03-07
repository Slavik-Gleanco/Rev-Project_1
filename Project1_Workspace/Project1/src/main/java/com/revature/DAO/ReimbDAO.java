package com.revature.DAO;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.revature.models.Reimb;
import com.revature.models.ReimbStatus;
import com.revature.models.ReimbType;
import com.revature.util.ConnectionFactory;

import oracle.jdbc.internal.OracleTypes;

public class ReimbDAO implements DAO<Reimb> {
private static Logger log = Logger.getLogger(UserDAO.class);
	
	@Override
	public List<Reimb> getAll() {
		
		List<Reimb> allReimbs = new ArrayList<>();

		try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

			CallableStatement cstmt = conn.prepareCall("{CALL get_all_reimbs(?)}");
			cstmt.registerOutParameter(1, OracleTypes.CURSOR);
			cstmt.execute();

			ResultSet rs = (ResultSet) cstmt.getObject(1);
			allReimbs = this.mapResultSet(rs);	

		} catch (SQLException e) {
			System.out.println();
			log.error("\n" + e.getMessage());
		}

		return allReimbs;
	}

	@Override
	public Reimb add(Reimb newReimb) 
	{
		try(Connection conn = ConnectionFactory.getInstance().getConnection())
		{
			conn.setAutoCommit(false);
			String sql = "INSERT INTO ers_reimbursement VALUES (0,?,?,?,?,?,?,?)";
			String[] keys = new String[1];
			keys[0] = "reimb_id";
			PreparedStatement pstmt  = conn.prepareStatement(sql,keys); 
			pstmt.setInt(1, newReimb.getReimbAmmount());
			pstmt.setTimestamp(2, newReimb.getSubmitted());
			pstmt.setTimestamp(3, newReimb.getResolved());
			pstmt.setString(4, newReimb.getDescription());
			pstmt.setInt(5, newReimb.getUserId());
			pstmt.setInt(6, newReimb.getStatus().getStatusId());
			pstmt.setInt(7, newReimb.getType().getTypeId());
			//pstmt.setInt(5, newReimb.getReceipt()
			
			
			if(pstmt.executeUpdate() != 0)
			{
				ResultSet rs = pstmt.getGeneratedKeys();
				
				while(rs.next())
				{
					newReimb.setReimbId(rs.getInt(1));
				}
				conn.commit();
			}
		}
		catch(SQLIntegrityConstraintViolationException ice)
		{
			log.error("\n" + ice.getMessage());
			log.warn("\n Username already taken");
			return null;
		}
	catch (SQLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
		return newReimb;
	}

	@Override
	public Reimb update(Reimb updatedReimb) {
		try(Connection conn = ConnectionFactory.getInstance().getConnection())
		{
			conn.setAutoCommit(false);
			
			String sql = "UPDATE ers_reimbursement SET reimb_amount = ?, reimb_submitted = ?, reimb_resolved = ?, +"
					+ " reimb_description = ?, reimb_status_id = ?, reimb_typed_id = ?, WHERE reimb_id = ?";
			
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, updatedReimb.getReimbAmmount());
			pstmt.setTimestamp(2, updatedReimb.getSubmitted());
			pstmt.setTimestamp(3, updatedReimb.getResolved());
			pstmt.setString(4, updatedReimb.getDescription());
			pstmt.setInt(5, updatedReimb.getStatus().getStatusId());
			pstmt.setInt(6, updatedReimb.getType().getTypeId());
			//pstmt.setInt(5, newReimb.getReceipt()
			
			if(pstmt.executeUpdate() != 0) {
				conn.commit();
				return updatedReimb;
			}
		}
			catch (SQLException e) {
		        e.printStackTrace();
		    }
			
		return	null;
	}

	@Override
	public boolean delete(int reimbId) {
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
            
            conn.setAutoCommit(false);
            
            PreparedStatement pstmt = conn.prepareStatement("DELETE FROM ers_reimbursement WHERE reimb_id = ?");
            pstmt.setInt(1, reimbId);
            
            if (pstmt.executeUpdate() > 0) {
                conn.commit();
                return true;
            }
            
        } catch (SQLException e) {
            System.out.println();
            log.error("\n" + e.getMessage());
        }
        
        return false;
	}
	
	private List<Reimb> mapResultSet(ResultSet rs) throws SQLException{
		
		List<Reimb> reimbsArray = new ArrayList<>();
		while(rs.next()) {	
			Reimb reimb = new Reimb();
			reimb.setReimbId(rs.getInt("reimb_id"));
			reimb.setReimbAmmount(rs.getInt("reimb_amount"));
			reimb.setSubmitted(rs.getTimestamp("reimb_submitted"));
			reimb.setResolved(rs.getTimestamp("reimb_approved"));
			reimb.setUserId(rs.getInt("ers_user_id"));
			reimb.setStatus(new ReimbStatus(rs.getInt("ers_status_id")));
			reimb.setType(new ReimbType(rs.getInt("ers_type_id")));
			reimb.setReceipt(rs.getBytes("ers_receipt"));
			reimb.setDescription(rs.getString("reimb_description"));
			
			reimbsArray.add(reimb);
		}
		return reimbsArray;
	}
}