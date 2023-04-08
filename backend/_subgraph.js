//importing necessary packages
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import axios from 'axios';

// GraphQL schema
const typeDefs = gql`
    type Transfer {
        id: ID!
        tokenId: String!
        transactionHash: String!
        blockNumber: String!
        blockTimestamp: String!
        from: String!
        to: String!
    }

    type Query {
        transfers: [Transfer]
    }
`;

//Resolving queries with real-time data
const resolvers = {
    Query: {
        transfers: async () => {
            try {
                const response = await axios.post(
                    'https://api.thegraph.com/subgraphs/name/comet19950902/miladys',
                    {
                        query: `
                            {
                                transfers(first:3, orderBy:blockTimestamp, orderDirection:desc){
                                    id,
                                    tokenId,
                                    transactionHash,
                                    blockNumber,
                                    blockTimestamp,
                                    from,
                                    to
                                }
                            }
                        `,
                    }
                );
                const data = response.data.data.transfers;
                console.log(data); // Print the data to console
                return data;
            } catch (error) {
                console.error(error);
            }
        },		
    },
};

// Creating an instance of the Apollo server using our typeDefs and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Initializing express app 
const app = express();

async function startServer() {
    // Start the server
    await server.start();

    // Integrate with apollo server
    server.applyMiddleware({ app });

    // Listen on port 3000
    app.listen({ port: 3000 }, async () => {
        console.log(`🌟 Server ready at http://localhost:3000${server.graphqlPath}`);
        // Execute the transfers query and print the result
        const { data } = await server.executeOperation({
            query: `
                query {
                    transfers {
                        id
                        tokenId
                        transactionHash
                        blockNumber
                        blockTimestamp
                        from
                        to
                    }
                }
            `,
        });
        console.log(data.transfers[0]);
    });
}  

// Call startServer function to start the server
startServer();