const router = require("express").Router();
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");

const UserModel = require("../models/User.model");
const GoalModel = require("../models/Goal.model");

const updateDBDocument = require("../utilities/update");
const isOwner = require("../utilities/isOwner");

router.post("/create-goal", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const createGoal = await GoalModel.create({
      ...req.body,
      owner: loggedInUser._id,
    });

    await UserModel.findOneAndUpdate(
      {
        _id: loggedInUser._id,
      },
      {
        $push: { goals: createGoal._id },
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json(createGoal);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
});

router.get("/my-goals", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const userGoals = await GoalModel.find(
      { owner: loggedInUser._id },
      { owner: 0, tasks: 0 }
    );

    return res.status(200).json(userGoals);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/user-goal/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const foundedGoal = await GoalModel.findOne({ _id: req.params.id });
    isOwner(foundedGoal.owner, loggedInUser._id);

    return res.status(200).json(foundedGoal);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.patch(
  "/user-goal/update/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const foundedGoal = await GoalModel.findOne({ _id: req.params.id });

      isOwner(foundedGoal.owner, loggedInUser._id);

      const goalUpdated = await updateDBDocument(
        GoalModel,
        { _id: foundedGoal._id },
        req.body
      );

      return res.status(200).json(goalUpdated);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

router.delete(
  "/user-goal/delete/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;
      const foundedGoal = await GoalModel.findOne({ _id: req.params.id });

      isOwner(foundedGoal.owner, loggedInUser._id);

      const removedGoal = await GoalModel.deleteOne({ _id: req.params.id });

      return res.status(200).json(removedGoal);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
