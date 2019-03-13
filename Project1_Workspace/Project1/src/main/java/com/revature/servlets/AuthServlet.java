package com.revature.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.revature.models.Principal;
import com.revature.models.Users;
import com.revature.services.UserService;
import com.revature.util.JwtConfig;
import com.revature.util.JwtGenerator;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(AuthServlet.class);
	
	private final UserService userService = new UserService();
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
		ObjectMapper mapper = new ObjectMapper();
		String[] credentials = null;
		
		try {
			credentials = mapper.readValue(req.getInputStream(), String[].class);
		} catch (MismatchedInputException mie) {
			log.error(mie.getMessage());
			resp.setStatus(400);
			return;
		} catch (Exception e) {
			log.error(e.getMessage());
			resp.setStatus(500);
			return;
		}
		
		if(credentials != null && credentials.length != 2) {
			log.warn("Invalid request, unexpected number of credential values");
			resp.setStatus(400);
			return;
		}
		
		Users user = userService.getUsersByCredentials(credentials[0], credentials[1]);
		System.out.println(user);
		
		if(user == null) {
			resp.setStatus(401);
			return;
		}
		
		resp.setStatus(200);
		resp.addHeader(JwtConfig.HEADER, JwtConfig.PREFIX + JwtGenerator.createJwt(user));
		resp.addHeader("Info",Integer.toString(user.getUser_id()));
	}
}
