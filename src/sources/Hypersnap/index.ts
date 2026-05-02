
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import HypersnapRestSource from '$/sources/Hypersnap/Rest/index.ts'

export default {
	provider: SourceProvider.Hypersnap,
	label: 'Hypersnap',
	sources: [
		HypersnapRestSource,
	],
} satisfies SourceProviderDefinition
