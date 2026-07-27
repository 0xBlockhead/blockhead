// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/FedimintClient/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.FedimintClient,
	label: 'Fedimint client',
	sources: [
		{
			source: Source.FedimintClient_Rpc,
			label: 'Fedimint client RPC',
		},
	],
	bindings: [bindings[Source.FedimintClient_Rpc]],
} satisfies SourceProviderDefinition
