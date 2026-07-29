// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
