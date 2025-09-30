const isAdmin = (req, res, next) => {
    // Check if the user object exists and the user's role is 'admin'
    if (req.user && req.user.role === "admin") {
        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // If the user is not an admin, send a 403 Forbidden response
        return res.status(403).json({
            error: true,
            message: "Access Denied. Admin privileges required."
        });
    }
};

export default isAdmin;
