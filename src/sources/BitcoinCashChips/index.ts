import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { bitcoinCashChipsBindings } from '$/sources/BitcoinCashChips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const bitcoinCashChipsOrigins = sourceOriginsFromBindings(bitcoinCashChipsBindings)

const bitcoinCashChipsSourceProviderDefinition = {
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
	origins: bitcoinCashChipsOrigins,
} satisfies SourceProviderDefinition

export default bitcoinCashChipsSourceProviderDefinition
