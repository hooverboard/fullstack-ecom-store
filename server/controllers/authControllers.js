const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.json({ message: "Passwords must match" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ messsage: "Email already taken" });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    return res.json({ message: "User Created" });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error creating user" });
  }
};

const loginUser = async (req, res) => {
  console.log("=== LOGIN ATTEMPT STARTED ===");
  console.log("Request body:", req.body);
  console.log("JWT Secret exists:", !!process.env.JWT_SECRET);

  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("Attempting to find user with email:", email);

    // Test if we can access the User model at all
    const userCount = await User.countDocuments();
    console.log("Total users in database:", userCount);

    // Try to find the specific user (removed .timeout() method)
    const userExists = await User.findOne({ email });
    console.log("Database query completed. User found:", !!userExists);

    if (userExists) {
      console.log("User found, checking password...");
      console.log("Stored password:", userExists.password);
      console.log("Provided password:", password);

      if (password === userExists.password) {
        console.log("Password matches, creating JWT...");

        jwt.sign(
          {
            email: userExists.email,
            id: userExists._id,
            name: userExists.name,
            role: userExists.role,
          },
          process.env.JWT_SECRET,
          {},
          (err, token) => {
            if (err) {
              console.error("JWT Signing Error:", err);
              return res
                .status(500)
                .json({ message: "Could not complete login" });
            }
            console.log("JWT created successfully");
            res
              .cookie("token", token, { httpOnly: true, sameSite: "lax" })
              .json({ message: "Logged in Successfully!" });
          }
        );
      } else {
        console.log("Password does not match");
        return res.status(400).json({ message: "Incorrect password" });
      }
    } else {
      console.log("No user found with that email");
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    console.error("=== END LOGIN ERROR ===");
    res.status(500).json({
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      }
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = { registerUser, loginUser, getProfile };
