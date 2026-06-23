import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { postgresQueryRequest } from '$/sources/_shared/wire/Postgres/client.ts'
import type { PostgresQueryRequest } from '$/sources/_shared/wire/Postgres/types.ts'

export const query = (
	binding: SourceBinding,
	request: PostgresQueryRequest
) => (
	postgresQueryRequest(binding, request)
)
