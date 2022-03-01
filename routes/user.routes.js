const router = require("express").Router();
const bcrypt = require("bcrypt");

const generateToken = require("../config/jwt.config");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");

const UserModel = require("../models/User.model");

const saltRounds = 10;

router.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser._doc);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: "Wrong password or email." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;

      const token = generateToken(user);

      return res.status(200).json({
        user: {
          ...user._doc,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Wrong password or email." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
});

router.get("/profile", isAuth, attachCurrentUser, (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    console.log(loggedInUser);
    if (loggedInUser) {
      console.log(loggedInUser);
      return res.status(200).json(loggedInUser);
    } else {
      console.log(loggedInUser);
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
});

router.patch("/profile/update", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
});

router.delete(
  "/disable-account",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const deletedUser = await UserModel.deleteOne({
        _id: loggedInUser._id,
      });

      return res.status(200).json(deletedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: JSON.stringify(error) });
    }
  }
);

module.exports = router;
