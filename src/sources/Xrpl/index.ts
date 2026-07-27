// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Xrpl/bindings.ts'

export default {
	provider: SourceProvider.Xrpl,
	label: 'XRPL rippled',
	sources: [
		{
			source: Source.Xrpl_Rippled,
			label: 'XRPL rippled JSON-RPC',
		},
	],
	bindings: [bindings[Source.Xrpl_Rippled]],
} satisfies SourceProviderDefinition
