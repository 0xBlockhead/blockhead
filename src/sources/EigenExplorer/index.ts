import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { eigenExplorerBindings } from '$/sources/EigenExplorer/bindings.ts'

export default {
	provider: SourceProvider.EigenExplorer,
	label: 'Eigen Explorer',
	sources: [
		{
			provider: SourceProvider.EigenExplorer,
			source: Source.EigenExplorer_Rest,
			label: 'Eigen Explorer REST',
		},
	],
	bindings: eigenExplorerBindings,
} satisfies SourceProviderDefinition
