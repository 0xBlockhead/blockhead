// Types/constants
import type { IR } from '@tanstack/svelte-db'
import {
	BaseQueryBuilder,
	compileSingleRowExpression,
	extractFieldPath,
	type Collection,
	type Context,
	type QueryBuilder,
	type Ref,
	type RefsForContext,
	type Source,
} from '@tanstack/svelte-db'

import {
	buildCompareOptionsForClause,
	makeComparatorFromCompareOptions,
} from '$/lib/tanstackDb/orderByComparison.ts'


type FieldRowContext<_FieldRow> = Context & {
	baseSchema: {
		fieldRow: _FieldRow
	}
	schema: {
		fieldRow: _FieldRow
	}
	fromSourceName: 'fieldRow'
}

export type OrderByStep<_FieldRow> = readonly [
	orderBy: (
		refs: { fieldRow: Ref<_FieldRow> }
	) => unknown,
	options?: 'asc' | 'desc' | {
		direction?: 'asc' | 'desc'
	}
]

export type DeclarativeOrderBy<_FieldRow> = (
	[_FieldRow] extends [never] ?
		readonly (readonly [
			orderBy: (
				refs: any
			) => unknown,
			options?: OrderByStep<any>[1],
		])[]
	:
		readonly OrderByStep<_FieldRow>[]
)

type BuilderWithInternalQuery = InstanceType<typeof BaseQueryBuilder> & {
	_getQuery(): { orderBy?: IR.OrderBy },
}

export const foldOrderBySteps = <
	_FieldRow,
	_QueryBuilder extends QueryBuilder<FieldRowContext<_FieldRow>>,
>(
	qb: _QueryBuilder,
	steps: readonly OrderByStep<_FieldRow>[],
): _QueryBuilder => (
	(() => {
		let ordered = qb
		for (const step of steps) {
			ordered = (
				step[1] === undefined ?
					ordered.orderBy(step[0] as (refs: RefsForContext<FieldRowContext<_FieldRow>>) => unknown)
				:
					ordered.orderBy(
						step[0] as (refs: RefsForContext<FieldRowContext<_FieldRow>>) => unknown,
						step[1],
					)
			) as _QueryBuilder
		}
		return ordered
	})()
)

/** Compile steps using the same builder IR TanStack uses internally (requires a real `from` source). */
export const orderByIrFromSteps = (
	from: Source,
	steps: DeclarativeOrderBy<any>,
) => {
	const qb = foldOrderBySteps(
		new BaseQueryBuilder().from(from) as never,
		steps,
	) as BuilderWithInternalQuery
	return qb._getQuery().orderBy ?? []
}

/** Stable subset of IR for live-query deps when `$orderByDep` is omitted */
export const fingerprintOrderByIr = (
	orderBy: IR.OrderBy,
): unknown => (
	orderBy.map((clause) => {
		const path = extractFieldPath(clause.expression)
		return (
			path === null ?
				null
			:
				[
					path,
						clause.compareOptions.direction,
						clause.compareOptions.nulls,
						clause.compareOptions.stringSort,
						'locale' in clause.compareOptions ? clause.compareOptions.locale : undefined,
					]
		)
	})
)

/** Sort with the same key extraction + comparators TanStack uses for those clauses (`compileSingleRowExpression` + `buildCompareOptions` + `makeComparator`). */
export const sortedWithOrderBySteps = <T>(
	from: Source,
	steps: DeclarativeOrderBy<any>,
	collectionForCompare: Collection<any>,
	items: readonly T[],
	toSortRow: (item: T) => Record<string, unknown>,
) => {
	const orderBy = orderByIrFromSteps(from, steps)
	if (orderBy.length === 0) {
		return [...items]
	}
	const compiled = orderBy.map((clause) => ({
		valueOf: compileSingleRowExpression(clause.expression),
		compare: makeComparatorFromCompareOptions(buildCompareOptionsForClause(clause, collectionForCompare)),
	}))
	return items.toSorted((a, b) => {
		const ra = toSortRow(a)
		const rb = toSortRow(b)
		for (const { valueOf, compare } of compiled) {
			const delta = compare(valueOf(ra), valueOf(rb))
			if (delta !== 0) {
				return delta
			}
		}
		return 0
	})
}
