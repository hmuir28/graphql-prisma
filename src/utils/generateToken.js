import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Maybe, you would like to add an expiration time to the token...
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

export default generateToken;
