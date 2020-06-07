const Mutation = {
  createComment: async (parent, args, { prisma }, info) => {
    const { data } = args;
    const userExists = await prisma.exists.User({ id: data.author });
    const postExists = await prisma.exists.Post({ id: data.post });

    if (!userExists || !postExists) throw new Error('Operation invalid!');

    return prisma.mutation.Comment({
      data: {
        ...data,
        author: {
          connect: {
            id: data.author,
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
    const emailTaken = await prisma.exists.User({ email: data.email });

    if (emailTaken) throw new Error('Email is already taken');

    return prisma.mutation.createUser({ data }, info);
  },
  createPost: async (parent, args, { prisma }, info) => {
    const { data } = args;
    const userExists = await prisma.exists.User({ id: data.author });

    if (!userExists) throw new Error('User not found');

    return prisma.mutation.Post({
      data: {
        ...data,
        author: {
          connect: {
            id: data.author,
          },
        },
      },
    }, info);
  },
  updateUser: async (parent, args, { prisma }, info) => {
    const { id, data } = args;

    const userExists = await prisma.exists.User({ id });

    if (!userExists) throw new Error('User not found!');

    if (data.email) {
      const emailTaken = prisma.exists.User({ email: data.email });

      if (emailTaken) throw new Error('Email is already taken!');
    }

    // @todo: clean up
    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  updatePost: async (parent, args, { prisma }, info) => {
    const { id, data } = args;
    const existPost = await prisma.exists.Post({ id });

    if (!existPost) throw new Error('Post not found!');

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  updateComment: async (parent, args, { prisma }, info) => {
    const { id, data } = args;

    const existComment = await prisma.exists.Comment({ id });

    if (!existComment) throw new Error('Comment not found!');

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },
  deleteComment: async (parent, args, { prisma }, info) => {
    const { id } = args;
    const existComment = await prisma.exists.Comment({ id });
    
    if (!existComment) throw new Error('Not found');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  deleteUser: async (parent, args, { prisma }, info) => {
    const { id } = args;
    const existUser = await prisma.exists.users({ id });
    
    if (!existUser) throw new Error('Not found');

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  deletePost: async (parent, args, { prisma }, info) => {
    const { id } = args;
    const existPost = await prisma.exists.Post({ id });

    if (!existPost) throw new Error('Post not found!');

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
};

export default Mutation;
