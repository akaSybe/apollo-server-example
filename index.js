const { GraphQLServer } = require('graphql-yoga');

const faker = require('faker');

// The GraphQL schema
const typeDefs = `
  directive @uppercase on FIELD | FIELD_DEFINITION

  type Query {
    "A simple type for getting started!"
    hello: String @uppercase
    users: [User!]!
  }

  type User {
    id: ID!
    name: String! @uppercase
    email: String!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
    users: () => {
      return Array(100).fill(null).map(() => ({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
      }));
    }
  },
};

const directiveResolvers = {
  uppercase(next, source, args, context) {
    return next().then(result => {
      return typeof result === 'string'
        ? result.toUpperCase()
        : result;  
    });
  }
}

const server = new GraphQLServer({ typeDefs, resolvers, directiveResolvers, tracing: true })
server.start({
  tracing: true,
}, () => console.log('Server is running on localhost:4000'))
