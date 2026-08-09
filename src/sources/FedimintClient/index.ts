import bindings from '$/sources/FedimintClient/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.FedimintClient,
	label: 'Fedimint client',
	sources: {
		[Source.FedimintClient_Rpc]: {
			label: 'Fedimint client RPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
