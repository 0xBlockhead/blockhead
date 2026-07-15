import { graphqlUrl } from '$/sources/Amboss/Graphql/constants.ts'

export const schemaSource = {
	schemaUrl: graphqlUrl,
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const
