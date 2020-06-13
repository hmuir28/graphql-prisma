import '@babel/polyfill';
import { GraphQLServer } from 'graphql-yoga';
import resolvers, { fragmentReplacements } from './resolver/index';
import prisma from './prisma';

// Resolvers
// hello within a Resolver is considered as an operation
// Parent, Arguments, Context and Info those are the parameters...

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => ({
    prisma,
    request,
  }),
  fragmentReplacements,
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log(`It's up and running...`);
})
