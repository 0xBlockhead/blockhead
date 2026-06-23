import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { PostgresQueryRequest } from '$/sources/_shared/wire/Postgres/types.ts'

export const postgresQueryRequest = (
	binding: SourceBinding,
	request: PostgresQueryRequest
) => ({
	binding,
	request,
})
