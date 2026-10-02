const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        });
    }

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token: token });
        if (isTokenBlacklisted) {
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: false,
            });
            return res.status(401).json({
                message: "Token is invalid"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: false,
        });
        return res.status(401).json({
            message: "Unauthorized or invalid token",
            error: err.message
        });
    }
}

module.exports = {authUser};