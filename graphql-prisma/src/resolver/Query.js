const Query = {
  comments: (parent, args, { prisma }, info) => {
    let query = {};

    if (args.query) {
      query = {
        where: {
          text_contains: args.query,
        },
      };
    }

    return prisma.query.comments(query, info);
  },
  users: (parent, args, { prisma }, info) => {
    let query = {};

    if (args.query) {
      query = {
        where: {
          OR: [{
            name_contains: args.query,
          }, {
            email_contains: args.query,
          }],
        },
      };
    }

    return prisma.query.users(query, info);
  },
  posts: (parent, args, { prisma }, info) => {
    let query = {};

    if (args.query) {
      query = {
        where: {
          OR: [{
            title_contains: args.query,
          }, {
            body_contains: args.query,
          }],
        },
      };
    }

    return prisma.query.posts(query, info);
  },
  me: () => ({
    id: () => '1',
    name: () => 'harry',
    email: () => 'harry182894@gmail.com',
    age: () => 25,
  }),
  post: () => ({
    id: () => 123,
    title: () => 'Fuck you up',
    body: () => 'NA',
    published: () => true,
  }),
};

export default Query;
