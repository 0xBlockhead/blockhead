// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NearNeps/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NearNeps,
	label: 'NEAR NEPs',
	sources: [
		{
			source: Source.NearNeps_Github,
			label: 'NEAR NEPs GitHub',
		},
	],
	bindings: [bindings[Source.NearNeps_Github]],
} satisfies SourceProviderDefinition
