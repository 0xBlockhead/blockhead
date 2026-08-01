// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Neynar/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Neynar,
	label: 'Neynar',
	sources: [
		{
			source: Source.Neynar_Rest,
			label: 'Neynar REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
