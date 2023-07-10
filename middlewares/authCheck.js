function isAuthenticated(request, response, next) {
    // Check if the user is authenticated
    if (request.isAuthenticated()) {
      // User is authenticated, proceed to the next middleware or route handler
      return next();
    }
  
    // User is not authenticated, redirect to login page or send an error response
    response.redirect(process.env.REACT_APP_SERVER_URL); // Example redirect to the login page
}
  
  
module.exports.isAuthenticated = isAuthenticated;