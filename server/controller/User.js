const { User } = require("../model/User");
const jwt = require("jsonwebtoken");
const secret = "sukraj@123";
const bcrypt = require("bcryptjs");
const {Sanitizer}=require("../middleware/Authentication")
exports.createUser = async (req, res) => {
  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "Sorry, a user with this email already exists!" });
    }

    // Generate a salt for bcrypt
    const salt = bcrypt.genSaltSync(10);

    // Create a new user instance and set its properties
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      password: hashPassword,
      email: req.body.email,
    });
    // Save the user to the database
     await user.save();
    // Create JWT token
    const token = jwt.sign(Sanitizer(user), secret);
    user.token=token;
    await user.save();
    return res
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      })
      .status(200)
      .send(Sanitizer(user));
  } catch (error) {
    console.error("Error in createUser:", error);
    return res
      .status(400)
      .json({ message: "User creation failed. Please try again later." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: "Email Address not found !!" });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(200).json({ message: "Incorrect Password !!" });
    }
    const token = jwt.sign(Sanitizer(user), secret);
    user.token=token;
    await user.save()
    res.header("token", token);
    return res
      .cookie("jwt", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      })
      
      .status(200)
      .send(Sanitizer(user));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers=async(req,res)=>{
  try {
    const user =await  User.find();
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error)
  }
}

