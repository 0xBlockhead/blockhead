import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { kaspaExplorerBindings } from '$/sources/KaspaExplorer/bindings.ts'

export default {
	provider: SourceProvider.KaspaExplorer,
	label: 'Kaspa Explorer',
	sources: [
		{
			provider: SourceProvider.KaspaExplorer,
			source: Source.KaspaExplorer_Rest,
			label: 'Kaspa Explorer REST',
		},
	],
	bindings: kaspaExplorerBindings,
} satisfies SourceProviderDefinition
