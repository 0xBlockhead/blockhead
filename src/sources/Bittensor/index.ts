// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Bittensor/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Bittensor,
	label: 'Bittensor',
	sources: [
		{
			source: Source.Bittensor_JsonRpc,
			label: 'Bittensor JSON-RPC',
		},
	],
	bindings: [bindings[Source.Bittensor_JsonRpc]],
} satisfies SourceProviderDefinition
