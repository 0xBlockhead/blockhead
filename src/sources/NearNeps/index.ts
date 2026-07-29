// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NearNeps/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.NearNeps,
	label: 'NEAR NEPs',
	sources: [
		{
			source: Source.NearNeps_Github,
			label: 'NEAR NEPs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
