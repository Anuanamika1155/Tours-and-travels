const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: "You're not authorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.error("Error verifying token:", err.message);
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }

        req.user = user;
        next();
    });
};

const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
        return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    });
};


module.exports = {verifyToken, verifyUser, verifyAdmin};
