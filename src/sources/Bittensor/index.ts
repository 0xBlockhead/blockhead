// Generated from APP.ts.

import bindings from '$/sources/Bittensor/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Bittensor,
	label: 'Bittensor',
	sources: [
		{
			source: Source.Bittensor_JsonRpc,
			label: 'Bittensor JSON-RPC',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
