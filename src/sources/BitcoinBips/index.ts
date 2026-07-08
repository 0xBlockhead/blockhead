import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { bitcoinBipsBindings } from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const bitcoinBipsOrigins = sourceOriginsFromBindings(bitcoinBipsBindings)

const bitcoinBipsSourceProviderDefinition = {
	provider: SourceProvider.BitcoinBips,
	label: 'Bitcoin BIPs',
	sources: [
		{
			provider: SourceProvider.BitcoinBips,
			source: Source.BitcoinBips_Github,
			label: 'Bitcoin BIPs GitHub',
		},
	],
	bindings: bitcoinBipsBindings,
	origins: bitcoinBipsOrigins,
} satisfies SourceProviderDefinition

export default bitcoinBipsSourceProviderDefinition
