import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const SECRET_KEY = "a9gY859f6WpaRX2BKML78Y3LlBynLR"

export const comparePassword = async (password, hashedPassword) => {
  // Use bcrypt's compare method to check if the passwords match
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign(
    {id : user._id, email: user.email , role : user.role},
    SECRET_KEY,
    {expiresIn : "90d"}
  )
}