package com.revature.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.util.List;

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
		System.out.println(principal);
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
				Reimb reimb = reimbService.addReimbs(new Reimb(0, Integer.parseInt(reimbInfo[0]),
							new Timestamp(System.currentTimeMillis()), null, Integer.parseInt(reimbInfo[1]), 
							reimbInfo[2], new ReimbStatus("Pending"), new ReimbType(reimbInfo[3])));
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
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		Principal principal = (Principal) req.getAttribute("principal");
		System.out.println("Principal: " + principal);
		String requestURI = req.getRequestURI();
		String[] userIdArr;
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			PrintWriter out = resp.getWriter();
			
			if(principal == null) {
				log.warn("No principal attribute found on request");
				resp.setStatus(401);
				return;
			}
			
			if(requestURI.equals("/Project1/request") || requestURI.equals("/Project1/request/")) {
				
				if(principal.getRole().equalsIgnoreCase("EMPLOYEE")) {
//					userIdArr = mapper.readValue(req.getInputStream(), String[].class);

					List<Reimb> reimbs = reimbService.getAllReimbsByUserId(Integer.parseInt(principal.getId()));
					String usersJSON = mapper.writeValueAsString(reimbs);
					resp.setStatus(200);
					resp.setHeader("info", usersJSON);
					out.write(usersJSON);
				}
				
				else if (principal.getRole().equalsIgnoreCase("MANAGER")) {
					List<Reimb> reimbs = reimbService.getAllReimbs();
					String usersJSON = mapper.writeValueAsString(reimbs);
					resp.setStatus(200);
					out.write(usersJSON);
				}
				
//				log.warn("Unauthorized access attempt made from origin: " + req.getLocalAddr());
//				resp.setStatus(401);
//				return;
				
			} else if (requestURI.contains("request/")) {
				
				String[] fragments = requestURI.split("/");
				
				String reimbId = fragments[3];
					
				if (!principal.getRole().equalsIgnoreCase("MANAGER") && !principal.getId().equalsIgnoreCase(reimbId)) {
					log.warn("Unauthorized access attempt made from origin: " + req.getLocalAddr());
					resp.setStatus(401);
					return;
				}
					
				Reimb reimb = reimbService.getReimbById(Integer.parseInt(reimbId));
				String userJSON = mapper.writeValueAsString(reimb);
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
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");
		Principal principal = (Principal) req.getAttribute("principal");
		
		String requestURI = req.getRequestURI();
		ObjectMapper mapper = new ObjectMapper();
		String [] reimbPatch;
		
		try {
			PrintWriter out = resp.getWriter();
			
			if(principal == null) {
				log.warn("No principal attribute found on request");
				resp.setStatus(401);
				return;
			}
			
			if(requestURI.equals("/Project1/request") || requestURI.equals("/Project1/request/")) {
				
				if (!principal.getRole().equalsIgnoreCase("MANAGER")) {
					log.warn("Unauthorized access attempt made from origin: " + req.getLocalAddr());
					resp.setStatus(401);
					return;
				}
                    
                    reimbPatch = mapper.readValue(req.getInputStream(), String[].class);
                    log.info(reimbPatch);
                    
//                    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yy hh:mm:ss.SSS");
//                    Date parsedDate = dateFormat.parse(reimbPatch[2]);
//                    Timestamp timestamp = new java.sql.Timestamp(parsedDate.getTime());
                      
                    Reimb reimb = reimbService.updateReimb(new Reimb(Integer.parseInt(reimbPatch[0]), Integer.parseInt(reimbPatch[1]),
                            new Timestamp(Long.parseLong(reimbPatch[2])), new Timestamp(System.currentTimeMillis()),Integer.parseInt(reimbPatch[3]), reimbPatch[4],
                            new ReimbStatus(reimbPatch[5]), new ReimbType(reimbPatch[6])));
                    String usersJSON = mapper.writeValueAsString(reimb);
                    resp.setStatus(200);
                    out.write(usersJSON);
				
			} else if (requestURI.contains("request/")) {
				
				String[] fragments = requestURI.split("/");
				
				String reimbId = fragments[3];
					
				if (!principal.getRole().equalsIgnoreCase("MANAGER") && !principal.getId().equalsIgnoreCase(reimbId)) {
					log.warn("Unauthorized access attempt made from origin: " + req.getLocalAddr());
					resp.setStatus(401);
					return;
				}
					
				Reimb reimb = reimbService.getReimbById(Integer.parseInt(reimbId));
				String userJSON = mapper.writeValueAsString(reimb);
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
