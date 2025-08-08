import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ 
        sucess:false , message: "Unauthorized" });
  }
  try {
    const userId = jwt.decode(token, process.env.JWT_SECRET)
     if (!userId) {
      return res.status(401).json({success: false ,  message: "Unauthorized" })
    }

   req.user =  await User.findById(userId).select("-password")
   next();
}
    catch(error) {
 return res.status(401).json({ 
        sucess:false , message: "Unauthorized" });
    }
}