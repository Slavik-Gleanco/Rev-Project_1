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
import com.revature.models.Principal;
import com.revature.models.Users;
import com.revature.services.UserService;

@WebServlet("/users/*")
public class UserServlet_Login extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(UserServlet_Login.class);
	
	private final UserService userService = new UserService();
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		Principal principal = (Principal) req.getAttribute("principal");
		
		String requestURI = req.getRequestURI();
		ObjectMapper mapper = new ObjectMapper();
		String[] credentials = null;
		
		try {
			PrintWriter out = resp.getWriter();
			
			if(principal == null) {
				log.warn("No principal attribute found on request");
				resp.setStatus(401);
				return;
			}
			
			if(requestURI.equals("/Project1/users") || requestURI.equals("/Project1/users/")) {
				
				credentials = mapper.readValue(req.getInputStream(), String[].class);
				log.info(credentials);
				Users user = userService.getUsersByCredentials(credentials[0], credentials[1]);
				String usersJSON = mapper.writeValueAsString(user);
				resp.setStatus(200);
				out.write(usersJSON);
				
			} else if (requestURI.contains("users/")) {
				
				String[] fragments = requestURI.split("/");
				
				String userId = fragments[3];
					
				if (!principal.getRole().equalsIgnoreCase("MANAGER") && !principal.getId().equalsIgnoreCase(userId)) {
					log.warn("Unauthorized access attempt made from origin: " + req.getLocalAddr());
					resp.setStatus(401);
					return;
				}
					
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
	
//	@Override
//	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
//		log.info("Request received by UserServlet.doPost()");
//		Users newUser = null;
//		
//		
//		ObjectMapper mapper = new ObjectMapper();
//		
//		try {
//			newUser = mapper.readValue(req.getInputStream(), Users.class);
//			//newUser = new Users();
//		} catch (MismatchedInputException mie) {
//			log.error(mie.getMessage());
//			resp.setStatus(400);
//			return;
//		} catch (Exception e) {
//			log.error(e.getMessage());
//			resp.setStatus(500);
//			return;
//		}
//		
//		newUser = userService.addUsers(newUser);
//		
//		try {
//			String userJson = mapper.writeValueAsString(newUser);
//			PrintWriter out = resp.getWriter();
//			out.write(userJson);
//		} catch (Exception e) {
//			log.error(e.getMessage());
//			resp.setStatus(500);
//		}
//	}
//
}
