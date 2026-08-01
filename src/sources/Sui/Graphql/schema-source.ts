/**
 * Sui Foundation mainnet GraphQL RPC introspection.
 * @see https://docs.sui.io/develop/accessing-data/graphql/graphql-rpc
 */
export const schemaSource = {
	schemaUrl: 'https://graphql.mainnet.sui.io/graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
	verifySchemaFromUrl: true,
} as const
