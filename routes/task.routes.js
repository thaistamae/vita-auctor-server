const router = require("express").Router();
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAuth = require("../middlewares/isAuth");

const updateDBDocument = require("../utilities/update");
const isOwner = require("../utilities/isOwner");

const GoalModel = require("../models/Goal.model");
const TaskModel = require("../models/Task.model");

router.post(
  "/create-task/:goalId",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;
      const findGoal = await GoalModel.findOne({ _id: req.params.goalId });

      isOwner(findGoal.owner, loggedInUser._id);

      const task = await TaskModel.create({
        ...req.body,
        goal: req.params.goalId,
      });

      const updateGoal = await GoalModel.findOneAndUpdate(
        { _id: req.params.goalId },
        { $push: { tasks: task } },
        { new: true, runValidators: true }
      ).populate("tasks");

      return res.status(200).json(updateGoal);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
