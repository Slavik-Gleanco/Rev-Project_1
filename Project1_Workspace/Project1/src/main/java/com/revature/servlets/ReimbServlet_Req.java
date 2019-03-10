package com.revature.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.models.Principal;
import com.revature.models.Reimb;
import com.revature.models.ReimbStatus;
import com.revature.models.ReimbType;
import com.revature.services.ReimbService;

@WebServlet("/request/*")
public class ReimbServlet_Req extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static Logger log = Logger.getLogger(UserServlet_Login.class);
	
	private final ReimbService reimbService = new ReimbService();

	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		Principal principal = (Principal) req.getAttribute("principal");
		
		String requestURI = req.getRequestURI();
		ObjectMapper mapper = new ObjectMapper();
		String [] reimbInfo;
		try {
			PrintWriter out = resp.getWriter();
			
			if(principal == null) {
				log.warn("No principal attribute found on request");
				resp.setStatus(401);
				return;
			}
			
			if(requestURI.equals("/Project1/request") || requestURI.equals("/Project1/request/")) {
				
				reimbInfo = mapper.readValue(req.getInputStream(), String[].class);
				log.info(reimbInfo);
				Reimb reimb = reimbService.addReimbs(new Reimb(Integer.parseInt(reimbInfo[0]), Integer.parseInt(reimbInfo[1]),
							new Timestamp(System.currentTimeMillis()),null ,Integer.parseInt(reimbInfo[2]), reimbInfo[3],
							new ReimbStatus(reimbInfo[4]), new ReimbType(reimbInfo[5])));
				String usersJSON = mapper.writeValueAsString(reimb);
				resp.setStatus(200);
				out.write(usersJSON);

				
			} else if (requestURI.contains("request/")) {
				
				String[] fragments = requestURI.split("/");
				
				String userId = fragments[3];
					
				Reimb user = reimbService.getReimbById(Integer.parseInt(userId));
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
