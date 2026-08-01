/**
 * Snapshot Hub's public GraphQL endpoint exposes its production schema through
 * standard introspection.
 * @see https://docs.snapshot.box/tools/api
 */
export const schemaSource = {
	schemaUrl: 'https://hub.snapshot.org/graphql',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const
