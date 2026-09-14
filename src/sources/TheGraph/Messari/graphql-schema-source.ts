import type { GraphqlSchemaSource } from '../../../../scripts/sources/graphql.ts'

export const schemaSource = {
	checkedInSchema: {
		file: './schema.graphql',
		format: 'sdl',
		sha256: 'd303d648e23f36f6056ea312bde57b0920d3ec44b59023f4dcaf8fd79c548796',
	},
	schemaName: 'MessariAmm',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const satisfies GraphqlSchemaSource
