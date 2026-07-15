/**
 * Aptos Indexer GraphQL introspection snapshot.
 * @see https://aptos.dev/en/build/indexer/indexer-api/api-reference
 */
export const schemaSource = {
	schemaUrl: 'https://api.mainnet.aptoslabs.com/v1/graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
	verifySchemaFromUrl: true,
} as const
