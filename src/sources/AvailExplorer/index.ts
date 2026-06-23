import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { availExplorerBindings } from '$/sources/AvailExplorer/bindings.ts'

export default {
	provider: SourceProvider.AvailExplorer,
	label: 'Avail Explorer',
	sources: [
		{
			provider: SourceProvider.AvailExplorer,
			source: Source.AvailExplorer_Rest,
			label: 'Avail Explorer REST',
		},
	],
	bindings: availExplorerBindings,
} satisfies SourceProviderDefinition
