const isAdmin = (req, res, next) => {
    // This check relies on the req.user object being attached by authMiddleWare.
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            error: true,
            message: "Access Denied. Admin privileges required."
        });
    }
};