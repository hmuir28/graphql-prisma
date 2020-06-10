import jwt from 'jsonwebtoken';

const getUserId = (request, requiredAuth = true) => {
  const header = request.request.headers.authorization;

  if (header) {
    const [, token] = header.split(' ');
    const { userId } = jwt.verify(token, 'thisismysecretkey');
    return userId;
  }

  if (requiredAuth) throw new Error('Authentication required.');
};

export default getUserId;
