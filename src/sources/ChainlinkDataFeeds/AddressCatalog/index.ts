// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const chainlinkDataFeedsAddressCatalogSourceDefinition = {
	provider: SourceProvider.ChainlinkDataFeeds,
	source: Source.ChainlinkDataFeeds_AddressCatalog,
	label: 'Chainlink Data Feeds address catalog',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default chainlinkDataFeedsAddressCatalogSourceDefinition
