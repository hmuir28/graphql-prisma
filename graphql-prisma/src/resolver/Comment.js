const Comment = {
  author: (parent, args, ctx, info) => ctx.users.find(user => user.id === parent.author),
  post: (parent, args, ctx, info) => ctx.posts.find(post => post.id === parent.post),
};

export default Comment;
