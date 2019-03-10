package com.revature.services;

import java.util.List;

import org.apache.log4j.Logger;

import com.revature.DAO.ReimbDAO;
import com.revature.models.Reimb;
import com.revature.models.Users;

public class ReimbService {

private static Logger log = Logger.getLogger(UserService.class);
	
	private ReimbDAO ReimbDao = new ReimbDAO();

	public List<Reimb> getAllReimbs() {
		return ReimbDao.getAll();
	}

	public Reimb getReimbById(int ReimbId) {
		return ReimbDao.getById(ReimbId);
	}

	public Reimb addReimbs(Reimb newReimb) {

		// Verify that there are no empty fields
		if (newReimb.getReimbAmount() <= 0 || newReimb.getDescription().equals("") || newReimb.getType().equals("")){
			log.info("New Reimbursement object is missing required fields");
			return null;
		}

		return ReimbDao.add(newReimb);
	}

	public Reimb updateReimb(Reimb updatedReimb) {

		// Verify that there are no empty fields
		if (updatedReimb.getReimbAmount() <= 0 || updatedReimb.getDescription().equals("") || updatedReimb.getType().equals("")){
			log.info("Updated Reimbursement object is missing required fields");
			return null;
		}
		
		// Attempt to persist the Users to the dataset
		Reimb persistedReimb = ReimbDao.update(updatedReimb);
		

		// If the update attempt was successful, update the currentUsers of AppState, and return the updatedUsers
		if (persistedReimb != null) {
			return updatedReimb;
		}

		// If the update attempt was unsuccessful, return null
		log.warn("Reimbursement update failed");
		return null;

	}

	public boolean deleteReimb(int ReimbId) {
		return ReimbDao.delete(ReimbId);
	}
}
