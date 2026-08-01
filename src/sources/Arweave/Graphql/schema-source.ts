/**
 * Public gateway schema for indexed Arweave transactions and blocks.
 * @see https://docs.ar.io/apis/ar-io-node/index-querying/
 */
export const schemaSource = {
	schemaUrl: 'https://arweave.net/graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const
