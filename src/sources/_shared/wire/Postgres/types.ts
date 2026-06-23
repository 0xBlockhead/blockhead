import type { JsonValue } from '$/typescript/JsonValue.ts'

export type PostgresQueryRequest = {
	sql: string
	values?: readonly JsonValue[]
}
