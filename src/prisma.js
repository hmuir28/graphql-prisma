import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolver/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
});

export default prisma;
