const Quiz = require('../../models/quiz')
const User = require('../../models/user')
const LatestQuiz = require('../../models/latestQuiz');
const paginationHelper = require('../../../../helper/pagination');
//lastest quiz
module.exports.lastestQuiz = async (req, res) => {
    try {
        const { quizId } = req.body;
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        const user = await User.findOne({
            token: token
        })
        if (!user) {
            return res.status(401).json({ message: "Please authenticate." });
        }
        
        const userExitsLatestQuiz = await LatestQuiz.findOne({ userID: user._id });
        if (!userExitsLatestQuiz) {
            const latestQuiz = new LatestQuiz({
                userID: user._id,
                quizIDs: quizId
            })
            await latestQuiz.save();
        } else {
            if(!userExitsLatestQuiz.quizIDs.includes(quizId)){
                    await LatestQuiz.updateOne({ userID: user._id }, {
                        $push: { quizIDs: quizId }
                })
            }
        }
        res.status(200).json({
            code: 200,
            message: "Success",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving latest quiz' });
    }
}
//list lastest quiz
module.exports.listLastQuiz = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        const user = await User.findOne({
            token: token
        })
        if (!user) {
            return res.status(401).json({ message: "Please authenticate." });
        }

        const listLastesQuiz = [];
        const userID = user._id;
        const latestQuiz = await LatestQuiz.find({ userID: userID });
        if (!latestQuiz || latestQuiz.length === 0) {
            return res.status(404).json({ message: "Latest quiz not found" });
        }
        let totalPages = 0;
        for (const latest of latestQuiz) {
            const { quizIDs } = latest;

            const totalQuizzes = await Quiz.countDocuments({ _id: { $in: quizIDs } }); 

            const paginationData = paginationHelper(
                {
                    currentPage: 1,
                    limit: 4,
                },
                totalQuizzes,
                req.query
            )
            totalPages = paginationData.totalPage
            if (quizIDs && quizIDs.length > 0) {
                if (!paginationData) {
                    return res.status(400).json({ message: 'Invalid pagination data.' });
                }
                const quizzes = await Quiz.find({ _id: { $in: quizIDs } })
                    .populate('userId', 'email userName')
                    .limit(paginationData.limit)
                    .skip(paginationData.skip);
                if (quizzes && quizzes.length > 0) {
                    listLastesQuiz.push(...quizzes);
                }
            }
        }

        if (listLastesQuiz.length === 0) {
            return res.status(404).json({ message: "No quizzes found" });
        }
        res.status(200).json({
            code: 200,
            message: "Success",
            data: listLastesQuiz,
            totalPages: totalPages
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving latest quiz' });
    }
}
