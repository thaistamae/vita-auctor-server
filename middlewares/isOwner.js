const GoalModel = require("../models/Goal.model");

module.exports = async (req, res, next) => {
  try {
    const loggedInUser = req.currentUser;

    const goal = await GoalModel.findOne({ _id: req.params.goalId });

    if (!loggedInUser._id === goal.owner) {
      return res
        .status(401)
        .json({ msg: "You do not have access to this goal." });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
