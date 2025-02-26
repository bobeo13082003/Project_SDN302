const User = require('../../models/user');
const Notification = require('../../models/notification');


// [GET] api/v1/notification/get-notification
module.exports.getNotification = async (req, res) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if(token){
        const user = await User.findOne({
            token: token,
        })
        const notification = await Notification.find({
            userId:user._id,
        }).sort({createdAt:"desc"})
        res.json({
            code:200,
            data: notification
        })
    }else{
        res.json({
            code:403,
            message: "Token Found"
        })
    }

}


// [PATCH] api/v1/notification/read-notification
module.exports.readNotification = async (req, res) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(token){
        const user = await User.findOne({
            token: token,
        })
        await Notification.updateMany({
            userId:user._id
        }, {isRead: true})
        res.json({
            code:200,
        })
    }else{
        res.json({
            code:403,
            message: "Token Found"
        })
    }
}

// [DELETE] api/v1/notification/delete-notification
module.exports.deleteNotification = async (req, res) => {
    const {idNotification} = req.query;
    await Notification.deleteOne({
        _id:idNotification
    })
    res.json({
        code:200,
        message:"Deleted Notification Successfully",
    })
}


