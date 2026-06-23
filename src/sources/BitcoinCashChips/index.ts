import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bitcoinCashChipsBindings } from '$/sources/BitcoinCashChips/bindings.ts'

export default {
	provider: SourceProvider.BitcoinCashChips,
	label: 'Bitcoin Cash CHIPs',
	sources: [
		{
			provider: SourceProvider.BitcoinCashChips,
			source: Source.BitcoinCashChips_Gitlab,
			label: 'Bitcoin Cash CHIPs GitLab',
		},
	],
	bindings: bitcoinCashChipsBindings,
} satisfies SourceProviderDefinition
