import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'
import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'


export const getEvmCatalogRows = () => (
	catalogRowsRequest(bindings[Source.CircleCctpContracts_Evm][0])
)

export const getSolanaCatalogRows = () => (
	catalogRowsRequest(bindings[Source.CircleCctpContracts_Solana][0])
)

export const getStellarCatalogRows = () => (
	catalogRowsRequest(bindings[Source.CircleCctpContracts_Stellar][0])
)
