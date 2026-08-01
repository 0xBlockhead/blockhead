// Generated from APP.ts.

import bindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
