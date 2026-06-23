import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bitcoinCashBcmrBindings } from '$/sources/BitcoinCashBcmr/bindings.ts'

export default {
	provider: SourceProvider.BitcoinCashBcmr,
	label: 'Bitcoin Cash Metadata Registries',
	sources: [
		{
			provider: SourceProvider.BitcoinCashBcmr,
			source: Source.BitcoinCashBcmr_Github,
			label: 'Bitcoin Cash BCMR GitHub',
		},
	],
	bindings: bitcoinCashBcmrBindings,
} satisfies SourceProviderDefinition
