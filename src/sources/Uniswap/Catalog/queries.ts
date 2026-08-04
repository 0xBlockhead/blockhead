import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'
import bindings from '$/sources/Uniswap/bindings.ts'
import { Source } from '$/sources/Source.ts'


export const getCatalogRows = () => (
	catalogRowsRequest(bindings[Source.UniswapContracts_Evm][0])
)
