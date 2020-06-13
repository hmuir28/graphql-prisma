import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Maybe, you would like to add an expiration time to the token...
  return jwt.sign({ userId }, 'thisismysecretkey');
};

export default generateToken;
