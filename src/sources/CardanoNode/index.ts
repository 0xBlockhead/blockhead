import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cardanoNodeBindings } from '$/sources/CardanoNode/bindings.ts'

export default {
	provider: SourceProvider.CardanoNode,
	label: 'Cardano node',
	sources: [
		{
			provider: SourceProvider.CardanoNode,
			source: Source.CardanoNode_LocalStateQuery,
			label: 'Cardano node local-state query',
		},
	],
	bindings: cardanoNodeBindings,
} satisfies SourceProviderDefinition
