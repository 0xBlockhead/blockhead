// Generated from APP.ts.

import bindings from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitcoinBips,
	label: 'Bitcoin BIPs',
	sources: [
		{
			source: Source.BitcoinBips_Github,
			label: 'Bitcoin BIPs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
