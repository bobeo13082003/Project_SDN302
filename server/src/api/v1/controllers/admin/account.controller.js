const Users = require("../../models/user");

// [PATCH] api/v1/users/updateStatus
module.exports.updateStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;

        // Validate status
        const validStatuses = ["active", "inactive"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                message: "Invalid status. Allowed values are: active, inactive, suspended.",
            });
        }

        // Find and update the user
        const updatedUser = await Users.findByIdAndUpdate(
            _id,
            { status: status },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                code: 404,
                message: "User not found.",
            });
        }

        res.json({
            code: 200,
            message: "User status updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "An error occurred while updating user status.",
        });
    }
};
