import type { GraphqlSchemaSource } from '../../../../scripts/sources/graphql.ts'

export const schemaSource = {
	checkedInSchema: {
		file: './schema.graphql',
		format: 'sdl',
		sha256: 'fc2c27ef77e92a9d316482ec523f49a2c9df042d231da4df9a00697910d48367',
	},
	schemaName: 'MessariAmm',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const satisfies GraphqlSchemaSource
