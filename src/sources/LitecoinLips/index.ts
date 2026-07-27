// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LitecoinLips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LitecoinLips,
	label: 'Litecoin LIPs',
	sources: [
		{
			source: Source.LitecoinLips_Github,
			label: 'Litecoin LIPs GitHub',
		},
	],
	bindings: [bindings[Source.LitecoinLips_Github]],
} satisfies SourceProviderDefinition
