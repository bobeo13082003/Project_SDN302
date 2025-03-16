const Admin = require("../../models/account-admin");
const Quiz = require("../../models/quiz");

// Helper function to validate admin token and role
// const validateAdmin = async (token) => {
//   if (!token) return { error: "Token is missing" };

//   const admin = await Admin.findOne({ token });
//   if (!admin) return { error: "Admin not found" };
//   if (admin.role !== "admin") return { error: "Permission denied" };

//   return { admin };
// };

// Get all quizzes, only accessible by admin
module.exports.allQuiz = async (req, res) => {
  try {
    // Extract and validate admin token
    // const authHeader = req.header("Authorization");
    // const token = authHeader?.split(" ")[1];
    // const { error } = await validateAdmin(token);

    // if (error) {
    //   return res.status(403).json({ message: error });
    // }

    // Fetch all quizzes without pagination
    const quizzes = await Quiz.find()
      .populate("questions")
      .populate("userId", "email userName")
      .sort({ createdAt: "desc" });

    res.status(200).json({
      code: 200,
      data: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove a quiz by ID
module.exports.removeQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the quiz
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Extract and validate admin token
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    const { error } = await validateAdmin(token);

    if (error) {
      return res.status(403).json({ message: error });
    }

    // Delete the quiz
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(500).json({ message: "Failed to delete the quiz" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error.message);
    res.status(500).json({ message: "Error deleting quiz" });
  }
};

// Update a quiz status by ID (hidden or show)
module.exports.toggleStatusQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the quiz
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Extract and validate admin token
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];
    const { error } = await validateAdmin(token);

    if (error) {
      return res.status(403).json({ message: error });
    }

    // Toggle the 'deleted' status
    quiz.deleted = !quiz.deleted;
    await quiz.save();

    res.status(200).json({
      message: `Quiz status toggled successfully`,
      updatedStatus: quiz.deleted,
    });
  } catch (error) {
    console.error("Error toggling quiz status:", error.message);
    res.status(500).json({ message: "Error toggling quiz status" });
  }
};
