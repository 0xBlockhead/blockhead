import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.ChainlinkDataFeeds,
	label: 'Chainlink Data Feeds',
	sources: {
		[Source.ChainlinkDataFeeds_AddressCatalog]: {
			label: 'Chainlink Data Feeds address catalog',
		},
		[Source.ChainlinkDataFeeds_Contracts]: {
			label: 'Chainlink Data Feeds contracts',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
