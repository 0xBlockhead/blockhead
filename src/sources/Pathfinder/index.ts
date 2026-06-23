import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { pathfinderBindings } from '$/sources/Pathfinder/bindings.ts'

export default {
	provider: SourceProvider.Pathfinder,
	label: 'Pathfinder',
	sources: [
		{
			provider: SourceProvider.Pathfinder,
			source: Source.Pathfinder_JsonRpc,
			label: 'Pathfinder JSON-RPC',
		},
	],
	bindings: pathfinderBindings,
} satisfies SourceProviderDefinition
