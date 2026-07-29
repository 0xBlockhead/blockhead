// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Github/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Github,
	label: 'GitHub',
	sources: [
		{
			source: Source.Github_Rest,
			label: 'GitHub REST',
		},
		{
			source: Source.Github_Git,
			label: 'GitHub Git',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
