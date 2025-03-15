const Users = require("../api/v1/models/user");

module.exports.Authorization = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      code: 401,
    });
  }
  try {
    next();
  } catch (error) {

    res.sendStatus(403);
  }
};

module.exports.AuthorizationAdmin = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.json({
      code: 401,
    });
  }
  const admin = await Users.findOne({ token });
  if (!admin) return { error: "Admin not found" };
  if (admin.role !== "admin") return { error: "Permission denied" };
  try {
    next();
  } catch (error) {

    res.sendStatus(403);
  }
};
