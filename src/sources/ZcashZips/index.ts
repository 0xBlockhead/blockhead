// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/ZcashZips/bindings.ts'

export default {
	provider: SourceProvider.ZcashZips,
	label: 'Zcash ZIPs',
	sources: [
		{
			source: Source.ZcashZips_Github,
			label: 'Zcash ZIPs GitHub',
		},
	],
	bindings: [bindings[Source.ZcashZips_Github]],
} satisfies SourceProviderDefinition
