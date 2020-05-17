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

    const userExists = users.some(u => u.id === data.author);

    if (!userExists) throw new Error('User not found');

    const post = { id: uuidv4(), ...data };

    posts.push(post);
    return post;
  },
  deleteComment: (parent, args, ctx, info) => {
    const commentIdx = ctx.comments.findIndex(c => c.id === args.id);
    
    if (commentIdx === -1) throw new Error('Not found');

    return ctx.comments.splice(commentIdx, 1)[0];
  },
  deleteUser: (parent, args, ctx, info) => {
    const userIdx = ctx.users.findIndex(c => c.id === args.id);
    
    if (userIdx === -1) throw new Error('Not found');

    return ctx.users.splice(userIdx, 1)[0];
  },
  deletePost: (parent, args, ctx, info) => {
    const postIdx = ctx.posts.findIndex(c => c.id === args.id);
    
    if (postIdx === -1) throw new Error('Not found');

    return ctx.posts.splice(postIdx, 1)[0];
  },
};

export default Mutation;
