const Post = {
  author: (parent, args, ctx, info) => ctx.users.find(user => user.id === parent.author),
  comments: (parent, args, ctx, info) => ctx.comments.filter(comment => comment.post === parent.id),
};

export default Post;
