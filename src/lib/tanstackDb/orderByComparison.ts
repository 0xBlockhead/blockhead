// Types/constants
import type { Collection, IR } from '@tanstack/svelte-db'


type CompareOpts = IR.OrderByClause['compareOptions']

/** Matches `@tanstack/db` `utils.js` temporal detection (not re-exported through `@tanstack/svelte-db`). */
const temporalToStringTags = new Set([
	`Temporal.Duration`,
	`Temporal.Instant`,
	`Temporal.PlainDate`,
	`Temporal.PlainDateTime`,
	`Temporal.PlainMonthDay`,
	`Temporal.PlainTime`,
	`Temporal.PlainYearMonth`,
	`Temporal.ZonedDateTime`,
])

const isTemporalComparable = (value: unknown) => (
	value != null
	&& typeof value === `object`
	&& typeof (value as { [Symbol.toStringTag]?: unknown })[Symbol.toStringTag] === `string`
	&& temporalToStringTags.has(
		String((value as { [Symbol.toStringTag]: string })[Symbol.toStringTag]),
	)
)

const objectIds = new WeakMap<object, number>()
let nextObjectId = 1

const getObjectId = (obj: object) => {
	const existing = objectIds.get(obj)
	if (existing !== undefined) {
		return existing
	}
	const id = nextObjectId++
	objectIds.set(obj, id)
	return id
}

const ascComparator = (
	a: unknown,
	b: unknown,
	opts: CompareOpts,
): number => {
	const { nulls } = opts
	if (a == null && b == null) return 0
	if (a == null) return nulls === `first` ? -1 : 1
	if (b == null) return nulls === `first` ? 1 : -1
	if (typeof a === `string` && typeof b === `string`) {
		if (opts.stringSort === `locale`) {
			return a.localeCompare(b, opts.locale, opts.localeOptions)
		}
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		for (let i = 0; i < Math.min(a.length, b.length); i++) {
			const result = ascComparator(a[i], b[i], opts)
			if (result !== 0) {
				return result
			}
		}
		return a.length - b.length
	}
	if (a instanceof Date && b instanceof Date) {
		return a.getTime() - b.getTime()
	}
	if (isTemporalComparable(a) && isTemporalComparable(b)) {
		const aStr = a.toString()
		const bStr = b.toString()
		if (aStr < bStr) return -1
		if (aStr > bStr) return 1
		return 0
	}
	const aIsObject = typeof a === `object`
	const bIsObject = typeof b === `object`
	if (aIsObject || bIsObject) {
		if (aIsObject && bIsObject) {
			return getObjectId(a as object) - getObjectId(b as object)
		}
		if (aIsObject) return 1
		if (bIsObject) return -1
	}
	if (a < b) return -1
	if (a > b) return 1
	return 0
}

const descComparator = (
	a: unknown,
	b: unknown,
	opts: CompareOpts,
): number => (
	ascComparator(b, a, {
		...opts,
		nulls: opts.nulls === `first` ? `last` : `first`,
	})
)

/** Mirrors `@tanstack/db` `makeComparator` / `buildCompareOptions` (not exported from package root). */
export const makeComparatorFromCompareOptions = (
	opts: CompareOpts,
): ((a: unknown, b: unknown) => number) => (
	(a, b) => (
		opts.direction === `asc` ?
			ascComparator(a, b, opts)
		:
			descComparator(a, b, opts)
	)
)

export const buildCompareOptionsForClause = (
	clause: IR.OrderByClause,
	collection: Collection<any>,
): CompareOpts => (
	clause.compareOptions.stringSort !== undefined ?
		clause.compareOptions
	:
		{
			...collection.compareOptions,
			direction: clause.compareOptions.direction,
			nulls: clause.compareOptions.nulls,
		}
)
