/**
 * ENS subgraph schema source.
 * - Query endpoint: The Graph gateway ENS mainnet deployment
 * - Schema source: ENS subgraph SDL in the ENS repo
 */
export const schemaSource = {
	sourceModule: 'TheGraph/Graphql/Ens',
	schemaUrl: 'https://raw.githubusercontent.com/ensdomains/ens-subgraph/master/schema.graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
	patchFile: './schema.patch.graphql',
} as const
