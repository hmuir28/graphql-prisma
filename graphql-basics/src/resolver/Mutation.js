import uuidv4 from 'uuid/v4';

const Mutation = {
  createComment: (parent, args, ctx, info) => {
    const { data } = args;
    const userExists = ctx.users.some(u => u.id === data.author);
    const postExists = ctx.posts.some(u => u.id === data.post);

    if (!userExists || !postExists) throw new Error('Operation invalid!');

    const comment = { id: uuidv4(), ...data };

    ctx.comments.push(comment);
    return comment;
  },
  createUser: (parent, args, ctx, info) => {
    // some => return true if some of the users have the same email, otherwise
    // it will return false
    const { data } = args;

    const emailTaken = ctx.users.some(u => u.email === data.email);

    if (emailTaken) throw new Error('Email is already taken');

    const user = { id: uuidv4(), ...data };

    ctx.users.push(user);
    return user;
  },
  createPost: (parent, args, ctx, info) => {
    const { data } = args;

    const userExists = ctx.users.some(u => u.id === data.author);

    if (!userExists) throw new Error('User not found');

    const post = { id: uuidv4(), ...data };

    ctx.posts.push(post);
    return post;
  },
  updateUser: (parent, args, ctx, info) => {
    const { id, data } = args;

    let userUpdated = ctx.users.find(u => u.id === id);

    if (!userUpdated) throw new Error('User not found!');

    if (data.email) {
      const emailTaken = ctx.users.some(u => u.email === data.email);

      if (emailTaken) throw new Error('Email is already taken!');
      userUpdated.email = data.email;
    }

    if (data.name) userUpdated.name = data.name;
    if (data.age) userUpdated.age = data.age;

    return userUpdated;
  },
  updatePost: (parent, args, ctx, info) => {
    const { id, data } = args;

    let postUpdated = ctx.posts.find(u => u.id === id);

    if (!postUpdated) throw new Error('Post not found!');

    if (data.title) postUpdated.title = data.title;
    if (data.body) postUpdated.body = data.body;
    if (data.published) postUpdated.published = data.published;

    return postUpdated;
  },
  updateComment: (parent, args, ctx, info) => {
    const { id, data } = args;

    let commentUpdated = ctx.comments.find(u => u.id === id);

    if (!commentUpdated) throw new Error('Comment not found!');

    if (data.text) commentUpdated.text = data.text;

    return commentUpdated;
  },
  deleteComment: (parent, args, ctx, info) => {
    const commentIdx = ctx.comments.findIndex(c => c.id === args.id);
    
    if (commentIdx === -1) throw new Error('Not found');

    return ctx.comments.splice(commentIdx, 1)[0];
  },
  deleteUser: (parent, args, ctx, info) => {
    const userIdx = ctx.users.findIndex(c => c.id === args.id);
    
    if (userIdx === -1) throw new Error('Not found');

    const userDeleted = ctx.users.splice(userIdx, 1)[0];

    ctx.posts = ctx.posts.filter(post => {
      const match = post.author === userDeleted.id

      if (!match) return !match;

      ctx.comments = ctx.comments.filter(
        comment => comment.author !== userDeleted.id,
      );

      return match;
    });

    return userDeleted;
  },
  deletePost: (parent, args, ctx, info) => {
    const postIdx = ctx.posts.findIndex(c => c.id === args.id);
    
    if (postIdx === -1) throw new Error('Not found');

    const postDeleted = ctx.posts.splice(postIdx, 1)[0];

    ctx.comments = ctx.comments.filter(comment => comment.post !== postDeleted.id);

    return postDeleted;
  },
};

export default Mutation;
