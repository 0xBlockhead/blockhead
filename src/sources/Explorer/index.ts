
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import ExplorerRestSource from '$/sources/Explorer/Rest/index.ts'

export default {
	provider: SourceProvider.Explorer,
	label: 'Explorer',
	sources: [
		ExplorerRestSource,
	],
} satisfies SourceProviderDefinition
