import { and, eq } from '@tanstack/svelte-db'

const valueByPath = (obj: Record<string, unknown>, path: string) => (
	path
		.split('.')
		.reduce(
			(acc, key) => (
				typeof acc === 'object' && acc != null ?
					(acc as Record<string, unknown>)[key]
				:	undefined
			),
			obj,
		)
)

/** TanStack `where`: compare row `$id` fields against entity id fields (order-insensitive). */
export const entityCollectionRowIdEqualsEntityIdByFields = (
	rowId: Record<string, unknown>,
	entityId: Record<string, unknown>,
	fields: readonly string[],
) => (
	fields.length <= 1 ?
		eq(
			valueByPath(rowId, fields[0] ?? ''),
			valueByPath(entityId, fields[0] ?? ''),
		)
	:	fields
			.slice(1)
			.reduce(
				(acc, field) => (
					and(
						acc,
						eq(
							valueByPath(rowId, field),
							valueByPath(entityId, field),
						),
					)
				),
				eq(
					valueByPath(rowId, fields[0]),
					valueByPath(entityId, fields[0]),
				),
			)
)
