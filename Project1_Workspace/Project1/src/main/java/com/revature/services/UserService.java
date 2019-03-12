package com.revature.services;

import java.util.List;

import org.apache.log4j.Logger;

import com.revature.DAO.UserDAO;
import com.revature.models.Users;

public class UserService {

	private static Logger log = Logger.getLogger(UserService.class);
	
	private UserDAO UsersDao = new UserDAO();

	public List<Users> getAllUsers() {
		return UsersDao.getAll();
	}

	public Users getUsersById(int UsersId) {
		return UsersDao.getById(UsersId);
	}

	public Users getUsersByUsersname(String Usersname) {
		return UsersDao.getByUsername(Usersname);
	}

	public Users getUsersByCredentials(String Usersname, String password) {

		Users Users = null;
		
		// Verify that neither of the credentials are empty string
		if (!Usersname.equals("") && !password.equals("")) {
			Users = UsersDao.getByCredentials(Usersname, password);
			if(Users != null) 
				return Users;
		}
		log.info("Empty Usersname and/or password value(s) provided"); 
		return null;
	}

	public Users addUsers(Users newUsers) {

		// Verify that there are no empty fields
		if (newUsers.getUserName().equals("") || newUsers.getPassword().equals("") || newUsers.getFirstName().equals("")
				|| newUsers.getLastName().equals("")) {
			log.info("New Users object is missing required fields");
			return null;
		}

		return UsersDao.add(newUsers);
	}

	public Users updateUsers(Users updatedUsers) {

		// Verify that there are no empty fields
		if (updatedUsers.getUserName().equals("") || updatedUsers.getPassword().equals("")
				|| updatedUsers.getFirstName().equals("") || updatedUsers.getLastName().equals("")) {
			log.info("Updated Users object is missing required fields");
			return null;
		}
		
		// Attempt to persist the Users to the dataset
		Users persistedUsers = UsersDao.update(updatedUsers);
		

		// If the update attempt was successful, update the currentUsers of AppState, and return the updatedUsers
		if (persistedUsers != null) {
			return updatedUsers;
		}

		// If the update attempt was unsuccessful, return null
		log.warn("Users update failed");
		return null;

	}

	public boolean deleteUsers(int UsersId) {
		return UsersDao.delete(UsersId);
	}
}
