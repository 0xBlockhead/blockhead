import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { chainlinkDataFeedsBindings } from '$/sources/ChainlinkDataFeeds/bindings.ts'

export default {
	provider: SourceProvider.ChainlinkDataFeeds,
	label: 'Chainlink Data Feeds',
	sources: [
		{
			provider: SourceProvider.ChainlinkDataFeeds,
			source: Source.ChainlinkDataFeeds_AddressCatalog,
			label: 'Chainlink Data Feeds address catalog',
		},
		{
			provider: SourceProvider.ChainlinkDataFeeds,
			source: Source.ChainlinkDataFeeds_Contracts,
			label: 'Chainlink Data Feeds contracts',
		},
	],
	bindings: chainlinkDataFeedsBindings,
} satisfies SourceProviderDefinition
