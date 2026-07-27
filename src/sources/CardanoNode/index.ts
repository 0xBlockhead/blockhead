// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CardanoNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CardanoNode,
	label: 'Cardano node',
	sources: [
		{
			source: Source.CardanoNode_LocalStateQuery,
			label: 'Cardano node local-state query',
		},
	],
	bindings: [bindings[Source.CardanoNode_LocalStateQuery]],
} satisfies SourceProviderDefinition
