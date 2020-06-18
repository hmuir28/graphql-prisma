import jwt from 'jsonwebtoken';

const getUserId = (request, requiredAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if (header) {
    const [, token] = header.split(' ');
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return userId;
  }

  if (requiredAuth) throw new Error('Authentication required.');
};

export default getUserId;
