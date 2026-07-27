import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'
import bindings from '$/sources/EigenLayer/bindings.ts'
import { Source } from '$/sources/Source.ts'

export const getCatalogRows = () => (
	catalogRowsRequest(bindings[Source.EigenLayerContracts_Evm])
)
