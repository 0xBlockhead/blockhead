// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Superchain/bindings.ts'

export default {
	provider: SourceProvider.Superchain,
	label: 'Superchain',
	sources: [
		{
			source: Source.Superchain_Github,
			label: 'Superchain GitHub',
		},
	],
	bindings: [bindings[Source.Superchain_Github]],
} satisfies SourceProviderDefinition
