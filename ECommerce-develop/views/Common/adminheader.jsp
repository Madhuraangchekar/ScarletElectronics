<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
 pageEncoding="ISO-8859-1" session="true" %>
<%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core' %>
<%-- <%
	HttpSession sessionsa = request.getSession(false);
	String username = (String) sessionsa.getAttribute("username");
%> --%>

<!-- <a href="http://www.google.com">click here for google</a> -->
		<%-- <div>
			<a href="loginPage.jsp">Home</a>
		</div>
		<div id="checkSession">Logged in user (first method) : <%= username %></div>
		<div id="checkSession2">Logged in user (second method): ${username}</div> --%>
		
		  <!-- Navbar -->
		<nav class="navbar sticky-top navbar-light bg-light">
			<div class="container-fluid">
				
					
			        <!-- Left links -->
			        <ul class="nav">
			          <li class="nav-item"><a class="nav-link navbar-brand"
				href="landingPage.jsp">Home</a></li>
			       
			          <li class="nav-item">
			            <a class="nav-link" href="CustomerRepresentative.jsp">Add Customer Representative</a>
			          </li>
			          <li class="nav-item">
			            <a class="nav-link" href="salesReports.jsp">Reports</a>
			          </li>

			          <li class="nav-item"><a class="nav-link"
							href="<%=request.getContextPath()%>/dashboard">Dashboard</a></li>
						<li class="nav-item"><a class="nav-link"
							href="<%=request.getContextPath()%>/biddingHistory">Public Bidding History</a></li>
						<li class="nav-item"><a class="nav-link"
							href="<%=request.getContextPath()%>/itemsPage">Add items to Watchlist</a>
						</li>
						<li class="nav-item">
			            <a class="nav-link" href="addItem.jsp">Add Item</a>
			          </li>
						<li class="nav-item"><a class="nav-link"
							href="<%=request.getContextPath()%>/listingSellItems">Buy</a></li>
						<li class="nav-item"><a class="nav-link"
							href="<%=request.getContextPath()%>/sellerPostingPageCall">Sell</a>
						</li>

			        </ul>
			        
			        <c:choose>
						<c:when test="${not empty username}">
							<ul class="nav">
								<li class="nav-item"><h4>Welcome ${username}! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4> </li>
			
								<li class="nav-item">
									<form action="<%=request.getContextPath()%>/logout" method="get">
										<button type="submit" class="btn btn-primary">Logout</button>
									</form>
								</li>
							</ul>
			
						</c:when>
						<c:otherwise>
						<ul class="nav">
							<li class="nav-item">
								<form action="loginPage.jsp" method="get">
									<button type="submit" class="btn btn-primary">Sign In</button>
								</form>
							</li>
						</ul>
						</c:otherwise>
					</c:choose>
			</div>
		</nav>