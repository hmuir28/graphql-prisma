import jwt from 'jsonwebtoken';

const getUserId = (request, requiredAuth = true) => {
  let header = {};

  if (request.request.headers.authorization) {
    header = request.request.headers.authorization;
  } else {
    header = request.connection.context.Authorization;
  }

  if (header) {
    const [, token] = header.split(' ');
    const { userId } = jwt.verify(token, 'thisismysecretkey');
    return userId;
  }

  if (requiredAuth) throw new Error('Authentication required.');
};

export default getUserId;
