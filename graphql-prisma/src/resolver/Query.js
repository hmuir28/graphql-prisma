import getUserId from '../utils/getUserId';

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

    return prisma.query.Comment(query, info);
  },
  users: (parent, args, { prisma }, info) => {
    let query = {
      first: args.first,
      skip: args.skip,
    };

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

  myPosts: (parent, args, { prisma, request }, info) => {
    const id = getUserId(request);
    const query = {
      where: {
        author: {
          id,
        },
      },
    };

    if (args.query) {
      query.where.OR = [{
        title_contains: args.query,
      }, {
        body_contains: args.query,
      }];
    }

    return prisma.query.Post(query, info);
  },

  posts: (parent, args, { prisma }, info) => {
    const query = {
      first: args.first,
      skip: args.skip,
      where: {
        published: true,
      },
    };

    if (args.query) {
      query.where.OR = [{
        title_contains: args.query,
      }, {
        body_contains: args.query,
      }];
    }

    return prisma.query.Post(query, info);
  },
  me: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request, false);

    const [user] = prisma.query.users({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error('Unable to find your information.');
    return user;
  },
  post: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request, false);

    const [post] = prisma.query.Post({
      where: {
        id: args.id,
        OR: [{
          author: {
            id: userId,
          },
        }, {
          published: true,
        }]
      }
    });

    if (!post) throw new Error('Unable to find Post.');
    return post;
  },
};

export default Query;
