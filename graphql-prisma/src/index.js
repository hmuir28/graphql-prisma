import { GraphQLServer, PubSub } from 'graphql-yoga';
import resolvers, { fragmentReplacements } from './resolver/index';
import prisma from './prisma';

// Resolvers
// hello within a Resolver is considered as an operation
// Parent, Arguments, Context and Info those are the parameters...

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => ({
    pubsub,
    prisma,
    request,
  }),
  fragmentReplacements,
});

server.start(() => {
  console.log(`It's up and running...`);
})
