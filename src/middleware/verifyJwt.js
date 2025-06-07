const jwt = require("jsonwebtoken");
const userModel  = require("../models/user.model");

const verifyJwt = async (req, res, next) => {
  const token =
    req.cookies.JwtToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loginUser = await userModel.findById(decoded.id).select("-password");
    req.user = loginUser;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(403).json({
      message: "Invalid token",
      error: err, // send full error so you can debug
    });
  }
};

module.exports = { verifyJwt };
