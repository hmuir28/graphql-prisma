import jwt from 'jsonwebtoken';

const getUserId = (request) => {
  const header = request.request.headers.authorization;

  if (!header) throw new Error('Authentication required.');

  const [, token] = header.split(' ');
  const { userId } = jwt.verify(token, 'thisismysecretkey');

  return userId;
};

export default getUserId;
