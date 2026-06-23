import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { catalogRowsRequest } from '$/sources/_shared/wire/CatalogRows/client.ts'

export const getCatalogRows = (binding: SourceBinding) => (
	catalogRowsRequest(binding)
)
