// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinBips,
	label: 'Bitcoin BIPs',
	sources: [
		{
			source: Source.BitcoinBips_Github,
			label: 'Bitcoin BIPs GitHub',
		},
	],
	bindings: [bindings[Source.BitcoinBips_Github]],
} satisfies SourceProviderDefinition
