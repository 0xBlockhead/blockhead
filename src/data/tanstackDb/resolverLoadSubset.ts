import { parseLoadSubsetOptions } from '@tanstack/svelte-db'
import type { LoadSubsetOptions } from '@tanstack/svelte-db'

export const fieldPathKey = (field: readonly (string | number | unknown)[]) => field.map(String).join('.')

export const subsetParsed = (o: LoadSubsetOptions | undefined) => (
	o == null ? { filters: [], sorts: [] } : parseLoadSubsetOptions(o)
)

export const loadSubsetFilters = (opts: LoadSubsetOptions | undefined) =>
	subsetParsed(opts).filters

export type ResolverLoadSubset = {
	filters: ReturnType<typeof loadSubsetFilters>
	limit?: number
	offset?: number
}

export const resolverContextFromLoadSubset = (opts: LoadSubsetOptions | undefined) => {
	if (opts == null) return undefined
	const { filters, limit } = subsetParsed(opts)
	return {
		loadSubset: {
			filters,
			limit,
			offset: opts.offset,
		},
	}
}

export const subsetFilterEqValue = (
	filters: ReturnType<typeof loadSubsetFilters>,
	path: string,
) => filters.find((f) => f.operator === 'eq' && fieldPathKey(f.field) === path)?.value

export const subsetFilterEqAsNumber = (
	filters: ReturnType<typeof loadSubsetFilters>,
	path: string,
) => {
	const raw = subsetFilterEqValue(filters, path)
	if (raw == null) return undefined
	if (typeof raw === 'number' && Number.isFinite(raw)) return raw
	if (typeof raw === 'string') {
		const n = Number(raw)
		return Number.isFinite(n) ? n : undefined
	}
	return undefined
}

export const sliceRowsForResolverSubset = <T>(rows: T[], subset: ResolverLoadSubset | undefined) => {
	if (subset == null) return rows
	const slice = rows.slice(subset.offset ?? 0)
	return subset.limit == null ? slice : slice.slice(0, subset.limit)
}
