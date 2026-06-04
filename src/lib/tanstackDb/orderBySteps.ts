// Types/constants
import type { IR } from '@tanstack/svelte-db'
import {
	BaseQueryBuilder,
	compileSingleRowExpression,
	extractFieldPath,
	type Collection,
	type Context,
	type OrderByCallback,
	type OrderByDirection,
	type OrderByOptions,
	type QueryBuilder,
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
	orderBy: OrderByCallback<FieldRowContext<_FieldRow>>,
	options?: OrderByDirection | OrderByOptions,
]

export type DeclarativeOrderBy<_FieldRow> = readonly OrderByStep<_FieldRow>[]

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
	steps.reduce(
		(acc, step) => (
			step[1] === undefined ?
				acc.orderBy(step[0])
			:
				acc.orderBy(step[0], step[1])
		),
		qb,
	) as _QueryBuilder
)

/** Compile steps using the same builder IR TanStack uses internally (requires a real `from` source). */
export const orderByIrFromSteps = (
	from: Source,
	steps: DeclarativeOrderBy<any>,
) => {
	let qb = new BaseQueryBuilder().from(from) as unknown as BuilderWithInternalQuery
	qb = foldOrderBySteps(qb, steps)
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
