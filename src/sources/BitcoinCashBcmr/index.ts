// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BitcoinCashBcmr/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitcoinCashBcmr,
	label: 'Bitcoin Cash Metadata Registries',
	sources: [
		{
			source: Source.BitcoinCashBcmr_Github,
			label: 'Bitcoin Cash BCMR GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
