const jwt = require("jsonwebtoken");
const { User } = require("../model/User");
const secret = "sukraj@123";
exports.Sanitizer = (user) => {
  return { id: user._id, email: user.email,username:user.username };
};

exports.Authentication = async (req, res, next) => {
  const token = req.cookies["jwt"];

  if (!token) {
    return res.status(401).send({ error: "Unauthorized - No token provided",success:true });
  }

  // Continue with token verification
  try {
    const decodedToken = jwt.verify(token, secret);
    const user = await User.findOne({ email: decodedToken.email });


    if (!user) {
      return res.status(404).json({ error: "User Not found" });
    }

    req.user = this.Sanitizer(user); // Use Sanitizer function here
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};


