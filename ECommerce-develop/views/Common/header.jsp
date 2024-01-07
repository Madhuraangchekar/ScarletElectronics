<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1" session="true"%>
<%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core'%>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.3/umd/popper.min.js"></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.min.js"></script>


<!-- Navbar -->
<nav class="navbar sticky-top navbar-light bg-light">
	<div class="container-fluid">


		<!-- Left links -->
		<ul class="nav">
			<li class="nav-item"><a class="nav-link navbar-brand"
				href="landingPage.jsp">Home</a></li>
			<li class="nav-item"><a class="nav-link"
				href="<%=request.getContextPath()%>/dashboard"">Dashboard</a></li>
			<li class="nav-item"><a class="nav-link"
				href="<%=request.getContextPath()%>/biddingHistory">Public Bidding History</a></li>

			<li class="nav-item"><a class="nav-link"
				href="<%=request.getContextPath()%>/listingSellItems">Buy</a></li>
			<li class="nav-item"><a class="nav-link"
				href="<%=request.getContextPath()%>/sellerPostingPageCall">Sell</a>
			</li>
			<li class="nav-item"><a class="nav-link"
				href="<%=request.getContextPath()%>/itemsPage">Add items to Watchlist</a></li>
				<li class="nav-item"><a class="nav-link"
				href="FAQ.jsp">Ask a Question</a></li>
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