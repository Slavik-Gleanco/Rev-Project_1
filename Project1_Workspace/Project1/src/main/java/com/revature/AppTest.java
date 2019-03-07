package com.revature;

import java.sql.Timestamp;
import java.util.List;

import com.revature.DAO.ReimbDAO;
import com.revature.DAO.UserDAO;
import com.revature.models.Reimb;
import com.revature.models.ReimbStatus;
import com.revature.models.ReimbType;
import com.revature.models.UserRoles;

public class AppTest {
	public static void main(String[] args)
	{
	
//	UserDAO userDao = new UserDAO();
//	UserRoles role = new UserRoles(2);
	ReimbDAO reimbDao = new ReimbDAO();
	ReimbStatus status = new ReimbStatus(1);
	ReimbType type = new ReimbType(2);
	Timestamp time = new Timestamp(6);
	
	Reimb newReimb = new Reimb(1, 300, time, time, 1, "Testing", status, type);
	//System.out.println(newReimb);
	
	reimbDao.add(newReimb);
	
	List<Reimb> allReimbs = reimbDao.getAll();
	for(Reimb r: allReimbs)
	{
		//reimbDao.delete(r.get);
		System.out.println(r);
	}
	
//	Users newUser = new Users(1,"Abes", "4321", "Abraham", "Shredder", role);
//	userDao.update(newUser);
//	userDao.delete(3);
//	
//	List<Users> allUsers = userDao.getAll();
//	for(Users e: allUsers)
//	{
//		System.out.println(e);
//	}
	
}
}
