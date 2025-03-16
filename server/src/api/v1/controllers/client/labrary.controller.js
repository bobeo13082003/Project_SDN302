const Labrary = require("../../models/labrary");
const Users = require("../../models/user");

//[POST] api/v1/labrary/add-labrary
module.exports.addLabrary = async (req, res) => {
    const { quizId, userId } = req.body;

    const userLabrary = await Labrary.findOne({
        userId: userId,
        deleted: false
    })

    if (userLabrary) {
        if (!userLabrary.quizId.includes(quizId)) {
            await Labrary.updateOne({
                userId: userId,
            }, { $push: { quizId } })
        }
    } else {
        const labrary = new Labrary({ userId: userId, quizId: quizId })
        await labrary.save()
    }

    res.json({ code: 200, message: "Add Labrary Successfully", });

}

//[POST] api/v1/labrary/get-all
module.exports.getLabrary = async (req, res) => {
    const { userId } = req.query;

    const labrary = await Labrary.findOne({
        userId: userId,
        deleted: false
    }).populate({ path: "quizId", populate: "userId" })

    res.json({
        code: 200,
        data: labrary,
    })

}

//[DELETE] api/v1/labrary/delete
module.exports.deleteLibrary = async (req, res) => {
    try {
        const { quizId } = req.params;
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];
        const user = await Users.findOne({ token: token })
        await Labrary.findOneAndUpdate({ userId: user._id }, { $pull: { quizId } });
        res.json({
            code: 200,
            message: "Deleted Library Successfully"
        })
    } catch (error) {
        res.json(error)
    }
}