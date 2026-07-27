// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AvalancheInfo/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AvalancheInfo,
	label: 'Avalanche Info API',
	sources: [
		{
			source: Source.AvalancheInfo_JsonRpc,
			label: 'Avalanche Info JSON-RPC',
		},
	],
	bindings: [bindings[Source.AvalancheInfo_JsonRpc]],
} satisfies SourceProviderDefinition
