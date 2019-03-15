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
import com.revature.models.Users;
import com.revature.services.UserService;

@WebServlet("/login/*")
public class UserServlet_Login extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(UserServlet_Login.class);
	
	private final UserService userService = new UserService();
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
	
		String requestURI = req.getRequestURI();
		ObjectMapper mapper = new ObjectMapper();
		String[] credentials = null;
		
		try {
			PrintWriter out = resp.getWriter();
			
			if(requestURI.equals("/Project1/login") || requestURI.equals("/Project1/login/")) {
				
				credentials = mapper.readValue(req.getInputStream(), String[].class);
				log.info(credentials);
				Users user = userService.getUsersByCredentials(credentials[0], credentials[1]);
				String usersJSON = mapper.writeValueAsString(user);
				resp.setStatus(200);
				out.write(usersJSON);
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
