
import jwt from "jsonwebtoken";

let secret = "12234567890";




function verifyUser(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: "Access Denied" })
    }
    try {
        const verifytoken = token.split(' ')[1];
        const decoded = jwt.verify(verifytoken, secret);
        // jwt.verify(token,secret);
        req.user_name = decoded.username;
        req.email = decoded.email;
        next();
    } catch (error) {
        res.status(422).json({ success: false, message: "Invaild token" })
    }
};
export default { verifyUser };