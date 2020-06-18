import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  login: async (parent, args, { prisma }, info) => {
    const { data } = args;
    const user = await prisma.query.user({
      where: {
        email: data.email,
      }
    });

    if (!user) throw new Error('Unable to login.');

    const isMatch = bcrypt.compare(data.password, user.password);

    if (!isMatch) throw new Error('Unable to login.');

    return {
      user,
      token: generateToken(user.id),
    };
  },
  createComment: async (parent, args, { prisma, request }, info) => {
    const { data } = args;
    const userId = getUserId(request);

    const existPosts = await prisma.exists.Post({
      id: data.post,
      published: true,
    });

    if (!existPosts) throw new Error('Unable to create comment for the Post');
    
    return prisma.mutation.createComment({
      data: {
        ...data,
        author: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: data.post,
          }
        },
      }
    }, info);
  },
  createUser: async (parent, args, { prisma }, info) => {
    const { data } = args;
    const password = await hashPassword(data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password,
      }
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },
  createPost: async (parent, args, { prisma, request }, info) => {
    const { data } = args;
    const id = getUserId(request);

    return prisma.mutation.Post({
      data: {
        ...data,
        author: {
          connect: {
            id,
          },
        },
      },
    }, info);
  },
  updateUser: async (parent, args, { prisma, request }, info) => {
    const { data } = args;
    const id = getUserId(request);

    if (typeof data.password === 'string') data.password = await hashPassword(data.password);

    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  updatePost: async (parent, args, { prisma, request }, info) => {
    const { id, data } = args;
    const userId = getUserId(request);
    const existPost = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });

    if (!existPost) throw new Error('Unable to update Post.');

    const isPublished = prisma.exists.Post({
      id,
      published: true,
    });

    if (isPublished && !data.published) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id,
          },
        },
      });
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  updateComment: async (parent, args, { prisma, request }, info) => {
    const { id, data } = args;
    const userId = getUserId(request);

    const existComment = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });

    if (!existComment) throw new Error('Unable to update Comment.');

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
  deleteComment: async (parent, args, { prisma, request }, info) => {
    const { id } = args;
    const userId = getUserId(request);

    const existComment = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });
    
    if (!existComment) throw new Error('Unable to delete Comment.');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  deleteUser: async (parent, args, { prisma, request }, info) => {
    const id = getUserId(request);
    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  deletePost: async (parent, args, { prisma, request }, info) => {
    const { id } = args;
    const userId = getUserId(request);

    const existPost = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });

    if (!existPost) throw new Error('Unable to delete post.');

    return prisma.mutation.deletePost({
      where: {
        id,
        author: {
          id: userId,
        },
      },
    }, info);
  },
};

export default Mutation;
