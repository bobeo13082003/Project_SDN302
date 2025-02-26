const Users = require("../../models/user")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const generalOtp = require('../../../../helper/generateRandom');
const ForgotPassword = require("../../models/forgot-password");
const sendMailHelper = require('../../../../helper/sendEmail')
// [POST] api/v1/auth/register
module.exports.register = async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hasPassword = await bcrypt.hash(password, salt);
        const emailExits = await Users.findOne({
            email: email,
            status: "active"
        })
        if (emailExits) {
            res.json({
                code: 402,
                message: "Email already exists. Please use a different email address"
            })
        } else {
            const user = new Users({
                email,
                userName,
                password: hasPassword
            });
            await user.save();
            res.json({
                code: 200,
                message: "Account registration successful."
            })
        }

    } catch (error) {
        console.log(error);
    }
}

// [POST] api/v1/auth/login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({
            email: email,
            status: "active",
        })

        if (!user) {
            res.json({
                code: 402,
                message: "The email address you entered does not exist."
            })
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.json({
                    code: 402,
                    message: "The password not correct."
                })
            } else {
                res.cookie('token', user.token)
                res.json({
                    code: 200,
                    token: user.token,
                    id:user.id,
                    message: "Login Successful."
                })
            }
        }

    } catch (error) {
        console.log(error);
    }
}
// [POST] api/v1/auth/forgot-password
module.exports.forgot = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await Users.findOne({
            email: email
        })
        if (!user) {
            return res.json({
                code: 402,
                message: "Email Address Not Exits."
            })
        }
        const otp = generalOtp.generateOtp(6);
        const objForgot = {
            email: email,
            otp: otp,
            "expireAt": Date.now()
        }
        const forgotPassword = new ForgotPassword(objForgot);
        await forgotPassword.save();
        res.json({
            code: 200,
            email: email
        })
        const subject = "Your One-Time Password (OTP) for Account Verification";
        const html = `To complete the verification process for your account, please use the following One-Time Password (OTP):

                        <h3>${otp}<h3/>This OTP is valid for the next 3 minutes. For security reasons, do not share this OTP with anyone.If you did not request this, please ignore this email or contact our support team immediately.`
        sendMailHelper.sendEmail(email, subject, html);
    } catch (error) {
        console.log(error);
    }
}
// [POST] api/v1/auth/otp
module.exports.otp = async (req, res) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        const forgot = await ForgotPassword.findOne({
            email: email,
            otp: otp
        })
        if (!forgot) {
            return res.json({
                code: 402,
                message: "Token Not Correct"
            })
        }
        const user = await Users.findOne({
            email: email
        })

        if (user) {
            res.cookie('forgotToken', user.token, {
                httpOnly: true, // Cookie không thể bị truy cập từ JavaScript
                secure: false,  // Đặt thành true trong môi trường sản xuất (HTTPS)
                sameSite: 'lax', // Chính sách SameSite
                maxAge: 3 * 60 * 1000 // Thời gian sống của cookie (3 phút)
            })
        }

        res.json({
            code: 200
        })
    } catch (error) {
        console.log(error);
    }
}

// [POST] api/v1/auth/reset-password
module.exports.reset = async (req, res) => {
    try {
        const forgotToken = req.cookies.forgotToken;
        if (!forgotToken) {
            return res.status(403).json({
                code: 403,
                message: "Token not found in cookies."
            });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(saltRounds);
        const hasPassword = await bcrypt.hash(password, salt);

        await Users.updateOne({
            token: forgotToken
        }, {
            password: hasPassword
        })
        res.json({
            code: 200,
            message: "Reset Password Successful."
        })

    } catch (error) {
        console.log(error);
    }
}
// api/v1/auth/user-profile
module.exports.profile = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        if(token){
            const user = await Users.findOne({
                token:token
            }).select('email userName')
            if(user){
                res.json({
                    code:200,
                    user:user
                })
            }
        }else{
            res.json({
                code:403,
                message: "Token Found"
            })
        }
    }catch (error){
        console.log(error)
    }
}
// api/v1/auth/edit-profile
module.exports.editProfile = async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        const userName = req.body.userName;
        if(token){
            const user = await Users.updateOne({
                token:token
            }, {userName:userName})
           res.json({
               code:200,
               message:"Update Successfull."
           })
        }
    }catch (error){
        console.log(error)
    }
}

