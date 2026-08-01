// Generated from APP.ts.

import bindings from '$/sources/BitcoinCashChips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BitcoinCashChips,
	label: 'Bitcoin Cash CHIPs',
	sources: [
		{
			source: Source.BitcoinCashChips_Gitlab,
			label: 'Bitcoin Cash CHIPs GitLab',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
