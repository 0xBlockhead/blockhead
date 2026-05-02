
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import LocalInternalSource from '$/sources/Local/Internal/index.ts'

export default {
	provider: SourceProvider.Local,
	label: 'Local',
	sources: [
		LocalInternalSource,
	],
} satisfies SourceProviderDefinition
