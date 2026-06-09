import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import LogosDocsRest from '$/sources/LogosDocs/Rest/index.ts'

export default {
	provider: SourceProvider.LogosDocs,
	label: 'Logos docs',
	origins: [
		{
			origin: 'https://docs.logoslabs.io',
			corsEnabled: true,
		},
	],
	sources: [
		LogosDocsRest,
	],
} as const satisfies SourceProviderDefinition
