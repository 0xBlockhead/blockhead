// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/TonCenter/bindings.ts'

export default {
	provider: SourceProvider.TonCenter,
	label: 'TON Center',
	sources: [
		{
			source: Source.TonCenter_V2_Rest,
			label: 'TON Center v2 REST',
		},
		{
			source: Source.TonCenter_V3_Rest,
			label: 'TON Center v3 REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
