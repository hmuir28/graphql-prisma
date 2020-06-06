const Query = {
  comments: (parent, args, ctx, info) => {
    if (args.query) {
      return ctx.comments
        .filter(comment =>
          comment.text.toLowerCase().includes(args.query),
        );
    }
    return ctx.comments;
  },
  users: (parent, args, ctx, info) => {
    if (args.query) {
      return ctx.users
        .filter(user =>
          user.name.toLowerCase().includes(args.query) || user.email.toLowerCase().includes(args.query),
        );
    }
    return ctx.users;
  },
  posts: (parent, args, ctx, info) => {
    if (args.query) {
      return ctx.posts
        .filter(post =>
          post.title.toLowerCase().includes(args.query) || post.body.toLowerCase().includes(args.query),
        );
    }
    return ctx.posts;
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
