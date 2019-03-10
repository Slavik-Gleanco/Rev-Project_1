package com.revature.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.models.UserRoles;
import com.revature.models.Users;
import com.revature.services.UserService;

@WebServlet("/register/*")
public class UserServlet_Register extends HttpServlet{

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(UserServlet_Login.class);
	
	private final UserService userService = new UserService();
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		//Principal principal = (Principal) req.getAttribute("principal");
		
		String requestURI = req.getRequestURI();
		ObjectMapper mapper = new ObjectMapper();
		String[] userInfo = null;
		
		try {
			PrintWriter out = resp.getWriter();
			
//			if(principal == null) {
//				log.warn("No principal attribute found on request");
//				resp.setStatus(401);
//				return;
//			}
			
			if(requestURI.equals("/Project1/register")) {
				
				userInfo = mapper.readValue(req.getInputStream(), String[].class);
				log.info(userInfo);
				Users user = userService.addUsers(new Users(Integer.parseInt(userInfo[0]), userInfo[1], userInfo[2], userInfo[3], userInfo[4], new UserRoles(userInfo[5])));
				String usersJSON = mapper.writeValueAsString(user);
				resp.setStatus(200);
				out.write(usersJSON);
				
			} else if (requestURI.contains("register/")) {
				
				String[] fragments = requestURI.split("/");
				
				String userId = fragments[3];
					
				Users user = userService.getUsersById(Integer.parseInt(userId));
				String userJSON = mapper.writeValueAsString(user);
				resp.setStatus(200);
				out.write(userJSON);		
			} 
		} catch (NumberFormatException nfe) {
				log.error(nfe.getMessage());
				resp.setStatus(400);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			resp.setStatus(500);
		}
	}
}