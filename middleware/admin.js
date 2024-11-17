const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.userId = decoded.id; // Store the admin ID in `req` for future use
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    adminMiddleware,
};
