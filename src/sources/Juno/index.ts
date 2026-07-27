// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Juno/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Juno,
	label: 'Juno',
	sources: [
		{
			source: Source.Juno_JsonRpc,
			label: 'Juno JSON-RPC',
		},
	],
	bindings: [bindings[Source.Juno_JsonRpc]],
} satisfies SourceProviderDefinition
