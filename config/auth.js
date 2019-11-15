// Middleware to check if user is logged in
function userAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return next();
  }

  console.log("user is not authenticated");
  res.render('login', {errMsg: "You are not logged in. Please log in to view this page."});
}

module.exports = userAuthenticated;