import bindings from '$/sources/Erigon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Erigon,
	label: 'Erigon',
	sources: {
		[Source.Erigon_JsonRpc]: {
			label: 'Erigon JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
