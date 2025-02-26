const User = require("../../models/user");
const Quiz = require("../../models/quiz");
const Blog = require("../../models/blog");

// [GET] api/v1/dashboard/stats/users
module.exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalAdmins = await User.countDocuments({ role: "admin" });

    const allAccounts = await User.countDocuments({
      role: { $in: ["user", "admin"] },
    });

    const roleDistribution = await User.aggregate([
      {
        $match: {
          role: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    let creationStats = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          count: 1,
          date: {
            $concat: [
              { $substr: ["$_id", 8, 2] }, 
              "-",
              { $substr: ["$_id", 5, 2] }, 
              "-",
              { $substr: ["$_id", 0, 4] },
            ],
          },
        },
      },
    ]);


    creationStats = creationStats.map((item, index, array) => {
      const previousCount = index > 0 ? array[index - 1].count : 0;
      const growthPercentage =
        previousCount > 0 ? ((item.count - previousCount) / previousCount) * 100 : 0;

      return {
        ...item,
        growthPercentage: parseFloat(growthPercentage.toFixed(2)), 
      };
    });

    res.json({
      code: 200,
      data: {
        totalUsers,
        totalAdmins,
        allAccounts,
        roleDistribution,
        creationStats,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

// [GET] api/v1/dashboard/stats/new-users
module.exports.getNewUsersInLastMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res
        .status(400)
        .json({ code: 400, message: "Year and month are required." });
    }

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

 
    const startOfPreviousMonth = new Date(year, month - 2, 1);
    const endOfPreviousMonth = new Date(year, month - 1, 0);

 
    const newUserCount = await User.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

 
    const previousMonthCount = await User.countDocuments({
      createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });

    const creationStats = await User.aggregate([
      {
        $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ]);


    const growthPercentage =
      previousMonthCount > 0
        ? ((newUserCount - previousMonthCount) / previousMonthCount) * 100
        : newUserCount > 0
        ? 100
        : 0; 

    res.json({
      code: 200,
      data: {
        creationStats, 
        newUserCount,
        previousMonthCount,
        growthPercentage: parseFloat(growthPercentage.toFixed(2)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
};

// [GET] api/v1/dashboard/stats/quiz
module.exports.getQuizStats = async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();

    let creationStats = await Quiz.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          count: 1,

          date: {
            $concat: [
              { $substr: ["$_id", 8, 2] },
              "-",
              { $substr: ["$_id", 5, 2] }, 
              "-",
              { $substr: ["$_id", 0, 4] }, 
            ],
          },
        },
      },
    ]);


    creationStats = creationStats.map((item, index, array) => {
      const previousCount = index > 0 ? array[index - 1].count : 0;
      const epsilon = 0.01; 
      const growthPercentage =
        previousCount > 0
          ? ((item.count - previousCount) / (previousCount + epsilon)) * 100
          : 0;

      return {
        ...item,
        growthPercentage: parseFloat(growthPercentage.toFixed(2)), 
      };
    });

    res.json({
      code: 200,
      data: {
        totalQuizzes,
        creationStats,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: "Error fetching quiz stats" });
  }
};

// [GET] api/v1/dashboard/stats/new-quiz
module.exports.getNewQuizzes = async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      code: 400,
      message: "Year and month are required.",
    });
  }

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const startOfPreviousMonth = new Date(year, month - 2, 1);
  const endOfPreviousMonth = new Date(year, month - 1, 0);

  try {
 
    const newQuizzesCount = await Quiz.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });


    const previousMonthQuizzesCount = await Quiz.countDocuments({
      createdAt: { $gte: startOfPreviousMonth, $lt: endOfPreviousMonth },
    });

   
    const growthPercentage =
      previousMonthQuizzesCount > 0
        ? ((newQuizzesCount - previousMonthQuizzesCount) /
            previousMonthQuizzesCount) *
          100
        : newQuizzesCount > 0
        ? 100
        : 0; 

    return res.json({
      code: 200,
      message: "New quizzes and growth data retrieved successfully",
      data: {
        newQuizzesCount,
        previousMonthQuizzesCount,
        growthPercentage: parseFloat(growthPercentage.toFixed(2)),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

// [GET] api/v1/dashboard/stats/blogs
module.exports.getBlogsStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const creationStats = await Blog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, 
      { $project: { date: "$_id", count: 1, _id: 0 } }, 
    ]);

    res.json({
      code: 200,
      data: {
        totalBlogs,
        creationStats,
      },
    });
  } catch (err) {
    console.error(err);
    res.json({ code: 500, message: "Error fetching blog stats" });
  }
};

// [GET] api/v1/dashboard/stats/top-quiz-creator
module.exports.getTopQuizCreator = async (req, res) => {
  try {
    const quizStats = await Quiz.aggregate([
      {
        $group: {
          _id: "$userId",
          quizCount: { $sum: 1 },
        },
      },
      { $sort: { quizCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$userInfo.userName",
          quizCount: 1,
        },
      },
    ]);

    if (quizStats.length > 0) {
      res.json({
        code: 200,
        data: quizStats,
      });
    } else {
      res.json({
        code: 404,
        message: "No quizzes found.",
      });
    }
  } catch (err) {
    console.error("Error fetching top quiz creators:", err);
    res
      .status(500)
      .json({ code: 500, message: "Error fetching top quiz creators" });
  }
};
