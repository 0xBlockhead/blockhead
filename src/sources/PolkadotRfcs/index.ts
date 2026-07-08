import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { polkadotRfcsBindings } from '$/sources/PolkadotRfcs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const polkadotRfcsOrigins = sourceOriginsFromBindings(polkadotRfcsBindings)

const polkadotRfcsSourceProviderDefinition = {
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
	origins: polkadotRfcsOrigins,
} satisfies SourceProviderDefinition

export default polkadotRfcsSourceProviderDefinition
