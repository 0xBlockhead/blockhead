// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Envio,
	label: 'Envio',
	sources: [
		{
			source: Source.EnvioHyperRpc_JsonRpc,
			label: 'Envio HyperRPC',
		},
		{
			source: Source.EnvioHyperSync_RawHttp,
			label: 'Envio HyperSync',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
