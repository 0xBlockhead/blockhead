// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Celestia/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Celestia,
	label: 'Celestia',
	sources: [
		{
			source: Source.Celestia_JsonRpc,
			label: 'Celestia JSON-RPC',
		},
	],
	bindings: [bindings[Source.Celestia_JsonRpc]],
} satisfies SourceProviderDefinition
