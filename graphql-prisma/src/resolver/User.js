const User = {
  posts: (parent, args, ctx, info) => ctx.posts.filter(post => post.author === parent.id),
  comments: (parent, args, ctx, info) => ctx.comments.filter(comment => comment.author === parent.id),
};

export default User;
