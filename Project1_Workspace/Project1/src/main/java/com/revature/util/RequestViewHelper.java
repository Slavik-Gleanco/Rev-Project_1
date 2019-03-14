package com.revature.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.revature.models.Principal;

public class RequestViewHelper {
private static Logger log = Logger.getLogger(RequestViewHelper.class);
	
	private RequestViewHelper() {}
	
	public static String process(HttpServletRequest request) {
		
		switch(request.getRequestURI()) {
		
		case "/Project1/login.view":
			log.info("Fetching login.html");
			return "partials/login.html";
		
		case "/Project1/register.view":
			log.info("Fetching register.html");
			return "partials/register.html";
		
		case "/Project1/viewReimb.view":
			Log.info("Fetching viewReimb.html");
			return "partials/viewReimb.html";
			
		case "/Project1/ViewManReimb.view":
			Log.info("Fetching ViewManReimb.html");
			return "partials/ViewManReimb.html";
			
		case "/Project1/ViewAllReimb.view":
			Log.info("Fetching ViewAllReimb.html");
			return "partials/ViewAllReimb.html";
			
		case "/Project1/submitReimb.view":
			Log.info("Fetching submitReimb.html");
			return "partials/submitReimb.html";
			
		case "/Project1/dashboard.view":
			
			Principal principal = (Principal) request.getAttribute("principal");
			
			if(principal == null) {
				log.warn("No principal attribute found on request object");
				return null;
			}
			
			log.info("Fetching dashboard.html");
			return "partials/dashboard.html";
			
		case "/Project1/managerDashboard.view":
			
			Principal principal2 = (Principal) request.getAttribute("principal");
			
			if(principal2 == null) {
				log.warn("No principal attribute found on request object");
				return null;
			}
			
			log.info("Fetching managerDashboard.html");
			return "partials/managerDashboard.html";
		
		default: 
			log.info("Invalid view requested");
			return null;
		
		}
	}
}
