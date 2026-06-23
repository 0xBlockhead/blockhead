import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { polkadotRfcsBindings } from '$/sources/PolkadotRfcs/bindings.ts'

export default {
	provider: SourceProvider.PolkadotRfcs,
	label: 'Polkadot RFCs',
	sources: [
		{
			provider: SourceProvider.PolkadotRfcs,
			source: Source.PolkadotRfcs_Github,
			label: 'Polkadot RFCs GitHub',
		},
	],
	bindings: polkadotRfcsBindings,
} satisfies SourceProviderDefinition
