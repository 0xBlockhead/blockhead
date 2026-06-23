import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bitcoinBipsBindings } from '$/sources/BitcoinBips/bindings.ts'

export default {
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
} satisfies SourceProviderDefinition
