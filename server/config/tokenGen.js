import jwt from "jsonwebtoken";
const jwt_key = process.env.JWT_KEY;

const tokenGen = (id) => {
  return jwt.sign({ id }, jwt_key, {
    expiresIn: "5d",
  });
};

export default tokenGen;
