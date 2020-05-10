import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
// Scalar types - String, Boolean, Int, Float, ID

// Learnt "!" is to specify whether require a value or not
// hello within a Type Definition is considered aa a query

// Demo user data
const users = [{
  id: '1',
  name: 'harry muir',
  email: 'harry182894@gmail.com',
  age: 27,
}, {
  id: '2',
  name: 'test test 123',
  email: 'testtest123@gmail.com',
  age: 29,
}, {
  id: '3',
  name: 'test 2',
  email: 'test2@gmail.com',
  age: 19,
}];

const posts = [{
  id: '1',
  title: 'this is a dummy post title (first)', 
  body: 'this is a dummy post body (first)',
  published: true,
  author: '1',
}, {
  id: '2',
  title: 'this is a dummy post title (second)', 
  body: 'this is a dummy post body (second)',
  published: false,
  author: '1',
}, {
  id: '3',
  title: 'this is a dummy post title (third)', 
  body: 'this is a dummy post body (third)',
  published: false,
  author: '1',
}];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    posts: [Post!]!
  }
`;

// Resolvers

// hello within a Resolver is considered as an operation

const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      if (args.query) {
        return users
          .filter(user =>
            user.name.toLowerCase().includes(args.query) || user.email.toLowerCase().includes(args.query),
          );
      }
      return users;
    },
    posts: (parent, args, ctx, info) => {
      if (args.query) {
        return posts
          .filter(post =>
            post.title.toLowerCase().includes(args.query) || post.body.toLowerCase().includes(args.query),
          );
      }
      return posts;
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
  },
  Post: {
    author: (parent, args, ctx, info) => users.find(user => user.id === parent.author),
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter(post => post.author === parent.id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log(`It's up and running...`);
})
