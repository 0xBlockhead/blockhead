import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import FilfoxRest from '$/sources/Filfox/Rest/index.ts'

export default {
	provider: SourceProvider.Filfox,
	label: 'Filfox',
	origins: [
		{
			origin: 'https://filfox.info',
			corsEnabled: true,
		},
	],
	sources: [
		FilfoxRest,
	],
} as const satisfies SourceProviderDefinition
