// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Ogmios/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Ogmios,
	label: 'Ogmios',
	sources: [
		{
			source: Source.Ogmios_JsonRpc,
			label: 'Ogmios JSON-RPC',
		},
	],
	bindings: [bindings[Source.Ogmios_JsonRpc]],
} satisfies SourceProviderDefinition
