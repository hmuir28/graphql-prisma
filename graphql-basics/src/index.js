import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import Query from './resolver/Query';
import Mutation from './resolver/Mutation';
import Comment from './resolver/Comment';
import Post from './resolver/Post';
import User from './resolver/User';

// Resolvers
// hello within a Resolver is considered as an operation
// Parent, Arguments, Context and Info those are the parameters...
const resolvers = { Query, Mutation, Comment, Post, User };

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    ...db,
  }
});

server.start(() => {
  console.log(`It's up and running...`);
})
