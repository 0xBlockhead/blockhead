import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/StellarRpc/bindings.ts'

export default {
	provider: SourceProvider.StellarRpc,
	label: 'Stellar RPC',
	sources: {
		[Source.StellarRpc_JsonRpc]: {
			label: 'Stellar RPC JSON-RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
