exports.checkAuth = async (req, res) => {
  const success = true;
  return res.status(200).send(req.user);
};
exports.Logout = async (req, res) => {
  return res.clearCookie("jwt").send({message:"logout successfully"})
};
