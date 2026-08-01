/**
 * EAS Scan publishes the same query surface across its network gateways.
 * Ethereum mainnet is the canonical public schema snapshot.
 * @see https://docs.attest.org/docs/developer-tools/api
 */
export const schemaSource = {
	schemaUrl: 'https://easscan.org/graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const
