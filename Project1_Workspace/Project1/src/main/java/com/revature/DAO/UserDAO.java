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

import com.revature.models.UserRoles;
import com.revature.models.Users;
import com.revature.util.ConnectionFactory;

import oracle.jdbc.internal.OracleTypes;

public class UserDAO implements DAO<Users> {
	
	private static Logger log = Logger.getLogger(UserDAO.class);
	
	@Override
	public List<Users> getAll() {
		
		List<Users> allUsers = new ArrayList<>();

		try (Connection conn = ConnectionFactory.getInstance().getConnection()) {

			CallableStatement cstmt = conn.prepareCall("{CALL get_all_users(?)}");
			cstmt.registerOutParameter(1, OracleTypes.CURSOR);
			cstmt.execute();

			ResultSet rs = (ResultSet) cstmt.getObject(1);
			allUsers = this.mapResultSet(rs);
				
		} catch (SQLException e) {
			System.out.println();
			log.error("\n" + e.getMessage());
		}

		return allUsers;
	}
	
	public Users getByCredentials(String username, String password) {
		
		Users user = null;
		
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
			
			PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM ers_users JOIN ers_user_roles USING (ers_role_id) WHERE ers_username = ? AND ers_password = ?");
			pstmt.setString(1, username);
			pstmt.setString(2, password);
			
			List<Users> users = this.mapResultSet(pstmt.executeQuery());
			if (!users.isEmpty()) user = users.get(0);
			
		} catch (SQLException e) {
			log.error(e.getMessage());
		}
				
		return user;
	}
	
	public Users getByUsername(String username) {
		
		Users user = null;
		
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
			
			PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM ers_users JOIN ers_user_roles USING (ers_role_id) WHERE ers_username = ?");
			pstmt.setString(1, username);
			
			List<Users> users = this.mapResultSet(pstmt.executeQuery());
			if (!users.isEmpty()) user = users.get(0);
			
		} catch (SQLException e) {
			log.error(e.getMessage());
		}
		
		return user;
	}
	
	public Users getById(int userId) {
		
		Users user = null;
		
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
			
			PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM ers_users JOIN ers_user_roles USING (ers_role_id) WHERE ers_user_id = ?");
			pstmt.setInt(1, userId);
			
			ResultSet rs = pstmt.executeQuery();
			List<Users> users = this.mapResultSet(rs);
			
			if (!users.isEmpty()) {
				user = users.get(0);
				user.setPassword("*********");
			}
			
		} catch (SQLException e) {
			log.error(e.getMessage());
		}
		
		return user;
	}

	@Override
	public Users add(Users newUser) 
	{
		try(Connection conn = ConnectionFactory.getInstance().getConnection())
		{
			conn.setAutoCommit(false);
			String sql = "INSERT INTO ers_users VALUES (0,?,?,?,?,?)";
			String[] keys = new String[1];
			keys[0] = "ers_user_id";
			PreparedStatement pstmt  = conn.prepareStatement(sql,keys); 
			pstmt.setString(1, newUser.getUserName());
			pstmt.setString(2, newUser.getPassword());
			pstmt.setString(3, newUser.getFirstName());
			pstmt.setString(4, newUser.getLastName());
			pstmt.setInt(5, newUser.getRole().getRoleId());
			
			
			if(pstmt.executeUpdate() != 0)
			{
				ResultSet rs = pstmt.getGeneratedKeys();
				
				while(rs.next())
				{
					newUser.setUser_id(rs.getInt(1));
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
		return newUser;
	}

	@Override
	public Users update(Users updatedUser) {
		try(Connection conn = ConnectionFactory.getInstance().getConnection())
		{
			conn.setAutoCommit(false);
			
			String sql = "UPDATE ers_users SET ers_password = ?, ers_first_name = ?, ers_last_name = ? WHERE ers_user_id = ?";
			
			PreparedStatement pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, updatedUser.getPassword());
			pstmt.setString(2, updatedUser.getFirstName());
			pstmt.setString(3, updatedUser.getLastName());
			pstmt.setInt(4, updatedUser.getUser_id());
			int rowsUpdated = pstmt.executeUpdate();
			
			if(rowsUpdated != 0) {
				conn.commit();
				return updatedUser;
			}
		}
			catch (SQLException e) {
		        // TODO Auto-generated catch block
		        e.printStackTrace();
		    }
			
		return	null;
	}

	@Override
	public boolean delete(int userId) {
		try(Connection conn = ConnectionFactory.getInstance().getConnection()) {
            
            conn.setAutoCommit(false);
            
            PreparedStatement pstmt = conn.prepareStatement("DELETE FROM ers_users WHERE ers_user_id = ?");
            pstmt.setInt(1, userId);
            
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
	
	private List<Users> mapResultSet(ResultSet rs) throws SQLException{
		
		List<Users> usersArray = new ArrayList<>();
		while(rs.next())
		{
			Users user = new Users();
			user.setUser_id(rs.getInt("ers_user_id"));
			user.setUserName(rs.getString("ers_username"));
			user.setPassword(rs.getString("ers_password"));
			user.setFirstName(rs.getString("ers_first_name"));
			user.setLastName(rs.getString("ers_last_name"));
			user.setRole(new UserRoles(rs.getInt("ers_role_id")));
			usersArray.add(user);
		}
		return usersArray;
	}
	
	
}
