// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Erigon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Erigon,
	label: 'Erigon',
	sources: [
		{
			source: Source.Erigon_JsonRpc,
			label: 'Erigon JSON-RPC',
		},
	],
	bindings: [bindings[Source.Erigon_JsonRpc]],
} satisfies SourceProviderDefinition
