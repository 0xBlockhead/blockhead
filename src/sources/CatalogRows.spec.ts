import {
	expect,
	it,
} from 'vitest'

import chainlinkBindings from '$/sources/ChainlinkDataFeeds/bindings.ts'
import {
	getCatalogRows as getChainlinkAddressCatalogRows,
} from '$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts'
import {
	getCatalogRows as getChainlinkContractCatalogRows,
} from '$/sources/ChainlinkDataFeeds/Contracts/Catalog/queries.ts'
import circleBindings from '$/sources/CircleCctp/bindings.ts'
import {
	getEvmCatalogRows,
	getSolanaCatalogRows,
	getStellarCatalogRows,
} from '$/sources/CircleCctp/Catalog/queries.ts'
import eigenLayerBindings from '$/sources/EigenLayer/bindings.ts'
import {
	getCatalogRows as getEigenLayerCatalogRows,
} from '$/sources/EigenLayer/Catalog/queries.ts'
import { Source } from '$/sources/Source.ts'

const catalogSources = [
	{
		name: 'Chainlink address catalog',
		getRows: getChainlinkAddressCatalogRows,
		binding: chainlinkBindings[Source.ChainlinkDataFeeds_AddressCatalog][0],
	},
	{
		name: 'Chainlink contract catalog',
		getRows: getChainlinkContractCatalogRows,
		binding: chainlinkBindings[Source.ChainlinkDataFeeds_Contracts][0],
	},
	{
		name: 'Circle CCTP EVM contract catalog',
		getRows: getEvmCatalogRows,
		binding: circleBindings[Source.CircleCctpContracts_Evm][0],
	},
	{
		name: 'Circle CCTP Solana program catalog',
		getRows: getSolanaCatalogRows,
		binding: circleBindings[Source.CircleCctpContracts_Solana][0],
	},
	{
		name: 'Circle CCTP Stellar contract catalog',
		getRows: getStellarCatalogRows,
		binding: circleBindings[Source.CircleCctpContracts_Stellar][0],
	},
	{
		name: 'EigenLayer EVM contract catalog',
		getRows: getEigenLayerCatalogRows,
		binding: eigenLayerBindings[Source.EigenLayerContracts_Evm][0],
	},
] as const

it.each(catalogSources)('binds $name rows to its distinct source coordinate', ({
	getRows,
	binding,
}) => {
	expect(getRows().binding).toBe(binding)
})
