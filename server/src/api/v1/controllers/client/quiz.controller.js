const Quiz = require('../../models/quiz');       // Corrected Quiz model import
const Question = require('../../models/question'); // Corrected Question model import
const User = require('../../models/user');         // Corrected User model import
const paginatinHelper = require('../../../../helper/pagination');
const { model } = require('mongoose');
// Get all quizzes, including questions and user information
module.exports.allQuiz = async (req, res) => {
    try {
        const totalQuizzes = await Quiz.countDocuments({ deleted: false });
        const paginationData = paginatinHelper(
            {
                currentPage: 1,
                limit: 12,
            },
            totalQuizzes,
            req.query
        );

        if (!paginationData) {
            return res.status(400).json({ message: 'Invalid pagination data.' });
        }
        const quizzes = await Quiz.find({ deleted: false })
            .populate('questions')
            .populate('userId', 'email userName')
            .limit(paginationData.limit)
            .skip(paginationData.skip)
            .sort({ createdAt: 'desc' });

        res.status(200).json({
            code: 200,
            data: quizzes,
            totalPage: paginationData.totalPage,
        });

    } catch (error) {
        console.error('Error fetching quizzes:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Add a new quiz with questions
module.exports.addQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        let userId;
        if (token) {
            const user = await User.findOne({
                token: token
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            userId = user._id;
        }
        // Create a new quiz
        const newQuiz = new Quiz({ title, description, userId });
        const savedQuiz = await newQuiz.save();

        // If questions are provided, add them to the quiz
        if (questions && questions.length > 0) {
            const questionIdList = [];

            for (const questionData of questions) {
                if (!questionData.questionText) {
                    return res.status(400).json({ message: 'Question text is required.' });
                }

                const question = new Question({
                    quizId: savedQuiz._id,
                    questionText: questionData.questionText,
                    image: questionData.image || null,
                    answerA: questionData.answerA || "",
                    answerB: questionData.answerB || "",
                    answerC: questionData.answerC || "",
                    answerD: questionData.answerD || "",
                    correctAnswer: questionData.correctAnswer || " No Answer",
                    type: questionData.type || "Null",
                });

                const savedQuestion = await question.save();
                questionIdList.push(savedQuestion._id);
            }

            // Update quiz with questions
            savedQuiz.questions = questionIdList;
            await savedQuiz.save();
        }

        res.status(201).json({ message: 'Quiz created successfully', quiz: savedQuiz });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error creating quiz' });
    }
};

// Remove a quiz by ID
module.exports.removeQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        let userId;
        if (token) {
            const user = await User.findOne({
                token: token
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            userId = user._id;
        }
        if (quiz.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this quiz' });
        }

        // Delete the quiz and send a success message
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(500).json({ message: 'Failed to delete the quiz' });
        }

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error.message);
        res.status(500).json({ message: 'Error deleting quiz' });
    }
};




//Delete Quizzes By All Roles
module.exports.deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        await Quiz.findByIdAndDelete(id);
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting quiz' });
    }
}

// Update quiz and its questions
module.exports.updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, questions } = req.body;

        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        let userId;
        if (token) {
            const user = await User.findOne({
                token: token
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            userId = user._id;
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userId.toString() !== quiz.userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this quiz' });
        }
        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.userId = userId;

        if (questions) {
            const questionIdList = [];

            for (const questionData of questions) {
                if (questionData._id) {
                    const existingQuestion = await Question.findById(questionData._id);
                    if (existingQuestion) {
                        existingQuestion.questionText = questionData.questionText || existingQuestion.questionText;
                        existingQuestion.image = questionData.image || existingQuestion.image;
                        existingQuestion.answerA = questionData.answerA || existingQuestion.answerA;
                        existingQuestion.answerB = questionData.answerB || existingQuestion.answerB;
                        existingQuestion.answerC = questionData.answerC !== undefined && questionData.answerC !== null 
                        ? questionData.answerC 
                        : existingQuestion.answerC;
                    
                    existingQuestion.answerD = questionData.answerD !== undefined && questionData.answerD !== null 
                        ? questionData.answerD 
                        : existingQuestion.answerD;
                        existingQuestion.correctAnswer = questionData.correctAnswer || existingQuestion.correctAnswer;
                        existingQuestion.type = questionData.type || existingQuestion.type;
                        await existingQuestion.save();
                        questionIdList.push(existingQuestion._id);
                    } else {
                        return res.status(404).json({ message: `Question with ID ${questionData._id} not found` });
                    }
                } else {
                    const newQuestion = new Question({
                        quizId: quiz._id,
                        questionText: questionData.questionText,
                        image: questionData.image || null,
                        answerA: questionData.answerA || "",
                        answerB: questionData.answerB || "",
                        answerC: questionData.answerC || "",
                        answerD: questionData.answerD || "",
                        correctAnswer: questionData.correctAnswer || " No Answer",
                        type: questionData.type || "Null",
                    });

                    const savedQuestion = await newQuestion.save();
                    questionIdList.push(savedQuestion._id);
                }
            }

            quiz.questions = questionIdList;
        }

        await quiz.save();
        res.status(200).json({ message: 'Quiz updated successfully', quiz });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating quiz' });
    }
};

// Remove a question by ID
module.exports.removeQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await Quiz.updateOne(
            { _id: question.quizId },
            { $pull: { questions: id } }
        );

        await Question.findByIdAndDelete(id);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting question' });
    }
};

module.exports.questionByQuizID = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz.questions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving questions' });
    }
};

module.exports.getQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('userId', 'userName user');
        res.status(200).json(quizzes);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving quiz' });
    }
}
module.exports.countQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find().countDocuments();
        res.status(200).json(quizzes);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving quiz' });
    }
}
module.exports.countTraffic = async (req, res) => {
    try {

        const { id } = req.params;
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        let userId;
        if (token) {
            const user = await User.findOne({
                token: token
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            userId = user._id;
        }
        const newTraffic = quiz.traffic + 1;
        await Quiz.updateOne({ _id: id }, { $set: { traffic: newTraffic } });

        res.json({
            message: 'Traffic updated successfully',
            updatedTraffic: newTraffic
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating quiz traffic' });
    }
}

module.exports.selectQuizMostTraffic = async function (req, res) {
    try {
        const totalQuizzes = await Quiz.countDocuments({ deleted: false });
        const paginationData = paginatinHelper(
            {
                currentPage: 1,
                limit: 4,
            },
            totalQuizzes,
            req.query
        );

        if (!paginationData) {
            return res.status(400).json({ message: 'Invalid pagination data.' });
        }
        const quizzes = await Quiz.find({ deleted: false })
            .populate('userId', 'email userName')
            .limit(paginationData.limit)
            .skip(paginationData.skip)
            .sort({ traffic: 'desc' });

        res.status(200).json({
            code: 200,
            data: quizzes,
            totalPage: paginationData.totalPage,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving most traffic quizzes' });
    }
}


module.exports.searchQuiz = async function (req, res) {
    try {
        const { search = '' } = req.query;
        const totalQuizzes = await Quiz.countDocuments({
            deleted: false,
            title: { $regex: search, $options: 'i' },
        });
        const paginationData = paginatinHelper(
            {
                currentPage: 1,
                limit: 4,
            },
            totalQuizzes,
            req.query
        );

        if (!paginationData) {
            return res.status(400).json({ message: 'Invalid pagination data.' });
        }
        const quizzes = await Quiz.find({
            deleted: false,
            title: { $regex: search, $options: 'i' },
        })
            .populate('userId', 'email userName')
            .limit(paginationData.limit)
            .skip(paginationData.skip)
            .sort({ traffic: 'desc' });


        res.status(200).json({
            code: 200,
            message: 'Success',
            data: quizzes,
            totalPage: paginationData.totalPage
        });
    } catch (error) {
        console.error('Error searching quizzes:', error.message);
        res.status(500).json({ message: 'Error retrieving quizzes' });
    }
}

module.exports.getUserQuiz = async (req, res) => {

    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        let userId;
        if (token) {
            const user = await User.findOne({
                token: token
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            userId = user._id;
            
        }
        const totalQuizzes = await Quiz.countDocuments({ userId: userId });
        
        const paginationData = paginatinHelper(
            {
                currentPage: 1,
                limit: 4,
            },
            totalQuizzes,
            req.query
        );

        if (!paginationData) {
            return res.status(400).json({ message: 'Invalid pagination data.' });
        }

        const quizzes = await Quiz.find({ userId: userId })
            .populate('userId', 'email userName')
            .sort({ createdAt: 'desc' })
            .limit(paginationData.limit)
            .skip(paginationData.skip);

        res.status(200).json({
            code: 200,
            message: 'Success',
            data: quizzes,
            totalPage: paginationData.totalPage
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error retrieving user quizzes' });
    }
}

const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
// Cấu hình multer để upload file
const upload = multer({ dest: 'uploads/' });

module.exports.addQuizFromExcel = [
    upload.single('file'), // middleware để upload file
    async (req, res) => {
        try {
            // Lấy token từ header Authorization
            const authHeader = req.header('Authorization');
            const token = authHeader && authHeader.split(' ')[1];
            let userId;

            // Kiểm tra nếu có token và xác thực người dùng
            if (token) {
                const user = await User.findOne({ token: token });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                userId = user._id;
            } else {
                return res.status(401).json({ message: 'Authorization token missing' });
            }

            // Kiểm tra nếu không có file
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Kiểm tra nếu không có title và description trong body
            const { title, description } = req.body;
            if (!title || !description) {
                fs.unlinkSync(req.file.path); // Xóa file tạm
                return res.status(400).json({ message: 'Title and description are required' });
            }

            // Đọc file Excel
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            if (!data || data.length === 0) {
                fs.unlinkSync(req.file.path); // Xóa file tạm
                return res.status(400).json({ message: 'Excel file is empty or invalid' });
            }

            // Tạo một quiz mới với title và description từ request body
            const newQuiz = new Quiz({ title, description, userId });
            const savedQuiz = await newQuiz.save();

            // Duyệt qua dữ liệu trong Excel và tạo danh sách câu hỏi
            const questions = data.map(row => {
                const { questionText, image, answerA, answerB, answerC, answerD, correctAnswer, type } = row;

                if (!questionText) {
                    return null; // Bỏ qua dòng không hợp lệ
                }

                return {
                    quizId: savedQuiz._id,
                    questionText,
                    image: image || null,
                    answerA: answerA || "",
                    answerB: answerB || "",
                    answerC: answerC || "",
                    answerD: answerD || "",
                    correctAnswer: correctAnswer || "No Answer",
                    type: type || "Null",
                };
            }).filter(Boolean); // Loại bỏ các giá trị null

            // Lưu danh sách câu hỏi vào MongoDB bằng bulk insert
            const savedQuestions = await Question.insertMany(questions);

            // Cập nhật danh sách câu hỏi vào quiz
            savedQuiz.questions = savedQuestions.map(q => q._id);
            await savedQuiz.save();

            // Xóa file tạm sau khi xử lý xong
            fs.unlinkSync(req.file.path);

            res.status(201).json({ message: 'Quiz created successfully from Excel', quiz: savedQuiz });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Error creating quiz from Excel' });
        }
    }
];


module.exports.exportQuestionsToExcel = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findById(id).populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const data = quiz.questions.map(question => ({
            questionText: question.questionText ? question.questionText.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : '',
            answerA: question.answerA ? question.answerA.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : '',
            answerB: question.answerB ? question.answerB.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : '',
            answerC: question.answerC ? question.answerC.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : '',
            answerD: question.answerD ? question.answerD.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : '',
            correctAnswer: question.correctAnswer ? question.correctAnswer.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : '',
            type: question.type ? question.type.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : ''
        }));

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Questions');

        // Generate the Excel file and send as a response
        const fileBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="quiz_questions.xlsx"');
        res.end(fileBuffer, 'binary'); // End the response with binary data
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error exporting quiz questions to Excel' });
    }
};
