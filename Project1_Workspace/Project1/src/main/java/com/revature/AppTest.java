package com.revature;

import java.sql.Timestamp;

import com.revature.DAO.ReimbDAO;
import com.revature.DAO.UserDAO;
import com.revature.models.Reimb;
import com.revature.models.ReimbStatus;
import com.revature.models.ReimbType;
import com.revature.models.UserRoles;

public class AppTest {
	public static void main(String[] args)
	{
	
	UserDAO userDao = new UserDAO();
	UserRoles role = new UserRoles(2);
	ReimbDAO reimbDao = new ReimbDAO();
	ReimbStatus status = new ReimbStatus(1);
	ReimbStatus status2 = new ReimbStatus(2);
	ReimbType type = new ReimbType(2);
	Timestamp time = new Timestamp(System.currentTimeMillis());
	//LocalDate date = LocalDate.now();
	
//	System.out.println(userDao.getByUsername("SlavG"));
//	System.out.println();
//	System.out.println(userDao.getById(1));
//	System.out.println();
//	System.out.println(userDao.getByCredentials("SlavG", "hi"));
	
	
	Reimb newReimb = new Reimb(1, 300, time, null, 1, "Testing", status, type);
	
	reimbDao.add(newReimb);
	//reimbDao.update(new Reimb(1, 350, null, null, 1, "Testing", status2, type));
	
	System.out.println("Operation Successful!");
	//System.out.println(reimbDao.getById(2));
//	
//	List<Reimb> allReimbs = reimbDao.getAll();
//	for(Reimb r: allReimbs)
//	{
//		//reimbDao.delete(r.get);
//		System.out.println(r);
//	}
	
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
