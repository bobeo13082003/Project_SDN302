const Admin = require("../../models/account-admin")
const bcrypt = require('bcrypt');
const saltRounds = 10;

// [POST] api/v1/auth/admin
module.exports.register = async (req, res) => {
    try {
        const {userName, password } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hasPassword = await bcrypt.hash(password, salt);

            const admin = new Admin({
                userName,
                password: hasPassword
            });
            await admin.save();
            res.json({
                code: 200,
                message: "Account registration successful."
            })

    } catch (error) {
        console.log(error);
    }
}

//[POST] api/v1/auth/admin/login
module.exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const admin = await Admin.findOne({
            userName: userName,
        })

        if (!admin) {
            res.json({
                code: 402,
                message: "The username you entered does not exist."
            })
        } else {
            const match = await bcrypt.compare(password, admin.password);
            if (!match) {
                res.json({
                    code: 402,
                    message: "The password not correct."
                })
            } else {
                res.cookie('token', admin.token)
                res.json({
                    code: 200,
                    token: admin.token,
                    role:admin.role,
                    message: "Login Successful."
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}