import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { polkadotBindings } from '$/sources/Polkadot/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const polkadotOrigins = sourceOriginsFromBindings(polkadotBindings)

const polkadotSourceProviderDefinition = {
	provider: SourceProvider.Polkadot,
	label: 'Polkadot',
	sources: [
		{
			provider: SourceProvider.Polkadot,
			source: Source.Polkadot_JsonRpc,
			label: 'Polkadot JSON-RPC',
		},
	],
	bindings: polkadotBindings,
	origins: polkadotOrigins,
} satisfies SourceProviderDefinition

export default polkadotSourceProviderDefinition
