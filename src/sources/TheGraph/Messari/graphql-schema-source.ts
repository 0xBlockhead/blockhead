import type { GraphqlSchemaSource } from '../../../../scripts/sources/graphql.ts'

export const schemaSource = {
	checkedInSchema: {
		file: './schema.graphql',
		format: 'sdl',
		sha256: '474594498535143728b484b3b2d01a49df66401f45df85adda2c765fef1fcb1b',
	},
	schemaName: 'MessariAmm',
	schemaFile: './schema.graphql',
	outputFile: './graphql-env.d.ts',
} as const satisfies GraphqlSchemaSource
