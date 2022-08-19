const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// create a salt for the user
const generateSalt = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// register a new user
const registerUser = async (req, res) => {
  const { isUser, userName, password } = req.body;

  // check if all fields are filled
  if (!isUser || !userName || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  // check if user already exists
  const userExists = await User.findOne({ userName });
  if (userExists) {
    return res.status(400).json({
      status: "fail",
      message: "User already exists",
    });
  }
  // create a salt for the user
  const createSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, createSalt);

  // create a new user
  const user = await User.create({
    userName,
    isUser,
    password: hashedPassword,
  });

  //return the user as json
  if (user) {
    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        userName: user.userName,
        isUser: user.isUser,
        _id: user._id,
      },
      token: await generateSalt(user._id),
    });
  } else {
    return res.status(400).json({
      status: "fail",
      message: "User not created",
    });
  }
};

// login a user
const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  // check if all fields are filled
  if (!userName || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all required fields",
    });
  }

  // check if user exists
  const user = await User.findOne({ userName });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User does not exist",
    });
  }

  // check if password is correct for the user
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: "fail",
      message: "Password is incorrect",
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        userName: user.userName,
        isUser: user.isUser,
        _id: user._id,
      },
      token: await generateSalt(user._id),
    });
  }
};

// get a user
const getUser = async (req, res) => {
  // get the user id from middleware
  const user = await User.findById(req.user.id);
  // check if user exists
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "User found",
      data: {
        userName: user.userName,
        isUser: user.isUser,
        _id: user._id,
      },
    });
  }
};

// update a user
const updateUser = async (req, res) => {
  const { userName, password, isUser } = req.body;
  // get the user id from middleware
  const user = await User.findById(req.user.id);
  // check if user exists
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  } else {
    // check if userName is filled
    if (!userName) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a userName",
      });
    } else {
      // check if password is filled
      if (!password) {
        return res.status(400).json({
          status: "fail",
          message: "Please provide a password",
        });
      } else {
        // check if isUser is filled
        if (!isUser) {
          return res.status(400).json({
            status: "fail",
            message: "Please provide a isUser",
          });
        } else {
          // update the user
          // hash the password
          const createSalt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, createSalt);
          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
              userName,
              password: hashedPassword,
              isUser,
            },
            { new: true }
          );
          // return the updated user
          return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: {
              userName: updatedUser.userName,
              isUser: updatedUser.isUser,
              _id: updatedUser._id,
            },
          });
        }
      }
    }
  }
};

// delete a user
const deleteUser = async (req, res) => {
  // get the user id from middleware
  const user = await User.findById(req.user.id);
  // check if user exists
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  } else {
    // delete the user
    const deletedUser = await User.findByIdAndDelete(user._id);
    // return the deleted user
    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: {
        userName: deletedUser.userName,
        isUser: deletedUser.isUser,
        _id: deletedUser._id,
      },
    });
  }
};

module.exports = {
  registerUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser,
};
