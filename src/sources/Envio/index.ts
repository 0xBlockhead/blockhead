import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Envio,
	label: 'Envio',
	sources: {
		[Source.EnvioHyperRpc_JsonRpc]: {
			label: 'Envio HyperRPC',
		},
		[Source.EnvioHyperSync_RawHttp]: {
			label: 'Envio HyperSync',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
