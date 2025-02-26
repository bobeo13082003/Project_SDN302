const GeneralSetting = require('../../models/generalSetting')

//[GET] api/v1/general-setting
module.exports.generalSetting = async (req, res) => {
    const generalSetting = await GeneralSetting.findOne({});
    res.json({
        code:200,
        data:generalSetting
    })
}

//[Post] api/v1/general-setting/edit
module.exports.editGeneralSetting = async (req, res) => {
    try {
        const generalSetting = await GeneralSetting.findOne({})
        if(generalSetting) {
            await GeneralSetting.updateOne({
                _id:generalSetting.id,
            }, req.body)
            res.json({code:200,message:"Edited Successfully",});
        }else{
            const newGeneralSetting = new GeneralSetting(req.body);
            await newGeneralSetting.save();
            res.json({code:200,message:"Create Successfully",});
        }
    }catch(err) {
        console.log(err)
    }
}