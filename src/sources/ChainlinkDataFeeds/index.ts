// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.ChainlinkDataFeeds,
	label: 'Chainlink Data Feeds',
	sources: [
		{
			source: Source.ChainlinkDataFeeds_AddressCatalog,
			label: 'Chainlink Data Feeds address catalog',
		},
		{
			source: Source.ChainlinkDataFeeds_Contracts,
			label: 'Chainlink Data Feeds contracts',
		},
	],
	bindings: [
		bindings[Source.ChainlinkDataFeeds_AddressCatalog],
		bindings[Source.ChainlinkDataFeeds_Contracts],
	],
} satisfies SourceProviderDefinition
