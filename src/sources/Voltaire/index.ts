// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Voltaire/bindings.ts'

export default {
	provider: SourceProvider.Voltaire,
	label: 'Voltaire',
	sources: [
		{
			source: Source.Voltaire_JsonRpc,
			label: 'Voltaire JSON-RPC',
		},
	],
	bindings: bindings[Source.Voltaire_JsonRpc],
} satisfies SourceProviderDefinition
