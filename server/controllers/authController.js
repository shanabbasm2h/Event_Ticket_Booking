import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body) {
      const { name, email, password } = req.body;
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(
        password,
        salt
      );
      const newUser = await User.create({
        name,
        email,
        password: passwordHash,
      });
      res.status(201).json({
        status: "success",
        newUser,
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (req.body) {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user)
        return res.status(400).json({
          status: "fail",
          message: "No User Found..",
        });
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );
      if (!isMatch)
        return res.status(400).json({
          status: "fail",
          message: "Invalid Credentials..",
        });
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
      );
      delete user.password;
      res.status(201).json({
        status: "success",
        user,
        token,
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // const verified = jwt.verify(
    //   token,
    //   process.env.JWT_SECRET
    // );
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    if (!currentUser) {
      return res.status(400).json({
        status: "fail",
        message: "No User Found..",
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
