/**
 * Messari-standardized Aave V3 Ethereum schema source.
 * - Query endpoint: current Aave V3 Ethereum deployment on The Graph gateway
 * - Schema source: Messari standardized lending SDL
 */
export const schemaSource = {
	sourceModule: 'TheGraph/Graphql/Messari/AaveV3/Ethereum',
	schemaUrl: 'https://raw.githubusercontent.com/messari/subgraphs/master/schema-lending.graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
	patchFile: './schema.patch.graphql',
} as const
