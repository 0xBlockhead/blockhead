import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cronosExplorerBindings } from '$/sources/CronosExplorer/bindings.ts'

export default {
	provider: SourceProvider.CronosExplorer,
	label: 'Cronos Explorer',
	sources: [
		{
			provider: SourceProvider.CronosExplorer,
			source: Source.CronosExplorer_Rest,
			label: 'Cronos Explorer REST',
		},
	],
	bindings: cronosExplorerBindings,
} satisfies SourceProviderDefinition
