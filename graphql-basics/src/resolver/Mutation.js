import uuidv4 from 'uuid/v4';

const Mutation = {
  createComment: (parent, args, { comments, users, posts, pubsub }, info) => {
    const { data } = args;
    const userExists = users.some(u => u.id === data.author);
    const postExists = posts.some(u => u.id === data.post);

    if (!userExists || !postExists) throw new Error('Operation invalid!');

    const comment = { id: uuidv4(), ...data };

    comments.push(comment);
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });
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
  createPost: (parent, args, { users, posts, pubsub }, info) => {
    const { data } = args;

    const userExists = users.some(u => u.id === data.author);

    if (!userExists) throw new Error('User not found');

    const post = { id: uuidv4(), ...data };

    posts.push(post);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

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
    const postUpdated = ctx.posts.find(u => u.id === id);
    const originalPost = { ...postUpdated };

    if (!postUpdated) throw new Error('Post not found!');

    if (data.title) postUpdated.title = data.title;
    if (data.body) postUpdated.body = data.body;
    if (typeof data.published === 'boolean') {
      postUpdated.published = data.published;

      if (originalPost.published && !postUpdated.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          }
        });
      } else if (!originalPost.published && postUpdated.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: postUpdated,
          }
        });
      }
    }  else if (postUpdated.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: postUpdated,
        }
      });
    }

    return postUpdated;
  },
  updateComment: (parent, args, { comments, pubsub }, info) => {
    const { id, data } = args;

    let commentUpdated = comments.find(u => u.id === id);

    if (!commentUpdated) throw new Error('Comment not found!');

    if (data.text) commentUpdated.text = data.text;

    pubsub.publish(`comment ${commentUpdated.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    });

    return commentUpdated;
  },
  deleteComment: (parent, args, { comments, pubsub }, info) => {
    const commentIdx = comments.findIndex(c => c.id === args.id);
    
    if (commentIdx === -1) throw new Error('Not found');

    const [comment] = comments.splice(commentIdx, 1);
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment,
      },
    });
    return comment;
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
  deletePost: (parent, args, { commnets, posts, pubsub }, info) => {
    const postIdx = posts.findIndex(c => c.id === args.id);
    
    if (postIdx === -1) throw new Error('Not found');

    const [postDeleted] = posts.splice(postIdx, 1);

    ctx.comments = comments.filter(comment => comment.post !== postDeleted.id);

    if (postDeleted.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: postDeleted,
        }
      });
    }

    return postDeleted;
  },
};

export default Mutation;
