const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get the token from the header
      token = req.headers.authorization.split(" ")[1];
      // verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user from the database
      req.user = await User.findOne({ _id: decoded.id }).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }
  }
};

module.exports = { protect };
