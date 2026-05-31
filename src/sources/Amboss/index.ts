import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import AmbossGraphql from '$/sources/Amboss/Graphql/index.ts'

export default {
	provider: SourceProvider.Amboss,
	label: 'Amboss Space',
	origins: [
		{
			origin: 'https://api.amboss.space',
			corsEnabled: true,
		},
	],
	sources: [
		AmbossGraphql,
	],
} as const satisfies SourceProviderDefinition
