// Generated from APP.ts.

import bindings from '$/sources/CardanoNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CardanoNode,
	label: 'Cardano node',
	sources: {
		[Source.CardanoNode_LocalStateQuery]: {
			label: 'Cardano node local-state query',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
