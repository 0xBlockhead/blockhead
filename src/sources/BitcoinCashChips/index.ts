// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BitcoinCashChips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinCashChips,
	label: 'Bitcoin Cash CHIPs',
	sources: [
		{
			source: Source.BitcoinCashChips_Gitlab,
			label: 'Bitcoin Cash CHIPs GitLab',
		},
	],
	bindings: [bindings[Source.BitcoinCashChips_Gitlab]],
} satisfies SourceProviderDefinition
