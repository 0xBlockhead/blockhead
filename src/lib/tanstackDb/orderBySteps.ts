// Types/constants
import type { IR } from '@tanstack/svelte-db'
import {
	BaseQueryBuilder,
	compileSingleRowExpression,
	extractFieldPath,
	type Collection,
	type OrderByCallback,
	type Source,
} from '@tanstack/svelte-db'

import {
	buildCompareOptionsForClause,
	makeComparatorFromCompareOptions,
} from '$/lib/tanstackDb/orderByComparison.ts'


/** Same tuple shape TanStack’s fluent `.orderBy(callback, options?)` accepts — exported as steps for reuse on queries and arrays */
type OrderByDirection = 'asc' | 'desc'
type OrderByOptions = {
	direction?: OrderByDirection
	nulls?: 'first' | 'last'
	stringSort?: 'locale' | 'binary'
	locale?: string
}

export type OrderByStep<_Context> = readonly [
	orderBy: OrderByCallback<any>,
	options?: OrderByDirection | OrderByOptions,
]

export type DeclarativeOrderBy<_Context> = readonly OrderByStep<_Context>[]

type BuilderWithInternalQuery = InstanceType<typeof BaseQueryBuilder> & {
	_getQuery(): { orderBy?: IR.OrderBy },
}

export const foldOrderBySteps = <
	_Context,
	QB,
>(
	qb: QB,
	steps: readonly OrderByStep<_Context>[],
): QB => (
	steps.reduce(
		(acc, step) => (
			step[1] === undefined ?
				acc.orderBy(step[0])
			:
				acc.orderBy(step[0], step[1] as any)
		),
		qb as any,
	) as unknown as QB
)

/** Compile steps using the same builder IR TanStack uses internally (requires a real `from` source). */
export const orderByIrFromSteps = (
	from: Source,
	steps: DeclarativeOrderBy<any>,
): IR.OrderBy => {
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
): T[] => {
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
