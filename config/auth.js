// Middleware function to check if user is logged in
function userAuthenticated(req, res, next) {

  // If user is authenticated, return next to move forward in the route
  if (req.isAuthenticated()) {
    return next();
  }

  // If user is not logged in, render login page with an error message
  console.log("User is not authenticated");
  res.render('login', {errMsg: "You are not logged in. Please log in to view this page."});
}

module.exports = userAuthenticated;