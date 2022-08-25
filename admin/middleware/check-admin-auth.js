import jwt from "jsonwebtoken";

export const checkAdminAuth = async (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  if (typeof tokenHeader == 'undefined') return res.status(403).send({ message: "A token is required for authentication", status: 400 });
  try {
    const bearer = tokenHeader.split(' ')[1]
    const decoded = jwt.verify(bearer, process.env.ADMIN_TOKEN_KEY);
    req.userData = decoded;
    req.token = bearer;
  } catch (err) {
    return res.status(400).send({ eroor: "Invalid Token", status: 400 });
  }
  return next();
}