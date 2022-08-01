import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  if (typeof tokenHeader == 'undefined') return res.status(403).send("A token is required for authentication");
  try {
    const bearer = tokenHeader.split(' ')[1]
    const decoded = jwt.verify(bearer, process.env.TOKEN_KEY);
    req.userData = decoded;
    req.token = bearer;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
}