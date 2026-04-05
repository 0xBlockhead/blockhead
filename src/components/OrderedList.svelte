<script module lang="ts">
	export enum SortDirection {
		Asc = 'asc',
		Desc = 'desc',
	}

	export enum OrderedListRowType {
		Item = 'item',
		Range = 'range',
	}

	export const parseRangeKey = (s: string): [number, number] => {
		const [a, b] = s.split('-').map(Number)
		return [a, b]
	}
</script>


<script
	lang="ts"
	generics="_Item"
>
	// Types/constants
	import type { ListPagination } from '$/components/RefinableList.svelte'
	import { visibility } from '$/svelte/visibility.svelte.ts'


	type OrderedListKey = number | bigint
	type Row = (
		| {
			type: OrderedListRowType.Item
			key: number
			item: _Item
		}
		| {
			type: OrderedListRowType.Range
			range: [number, number]
		}
	)


	// State
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { Snippet } from 'svelte'

	let {
		items = $bindable(
			new Set<_Item>()
		),
		getKey,
		sortDirection = SortDirection.Desc,

		placeholderRanges,
		placeholderRangeLabel = (lo: number, hi: number) => (
			lo === hi ?
				`Item ${lo}`
			:
				`Items ${lo}–${hi}`
		),
		visiblePlaceholderRanges = $bindable(
			new Set<string>()
		),
		onLoadMorePlaceholders,

		sliceLimit: sliceLimitProp,
		scrollPosition = 'Auto',
		pagination,

		summary = $bindable({
			loaded: 0,
			total: undefined as number | undefined,
		}),

		Item,
		PlaceholderRange,
		Empty,

		...olProps
	}: WithRest<
		{
			items: Set<_Item>
			getKey: (item: _Item) => OrderedListKey
			sortDirection?: SortDirection

			placeholderRanges: Iterable<[number, number] | readonly [number, number]>
			placeholderRangeLabel?: (lo: number, hi: number) => string
			visiblePlaceholderRanges?: Set<string>
			onLoadMorePlaceholders?: () => void

			sliceLimit?: number
			scrollPosition?: 'Start' | 'End' | 'Auto'
			pagination?: ListPagination

			summary?: { loaded: number; total?: number }

			Item: Snippet<[
				{
					key: number,
					isVisible: boolean,
				} & (
					| { item: _Item; isPlaceholder: false }
					| { item?: never; isPlaceholder: true }
				),
			]>
			PlaceholderRange?: Snippet<[{
				range: [number, number],
				isVisibleStart: boolean,
				isVisibleEnd: boolean,
			}]>
			Empty?: Snippet
		},
		SvelteHTMLElements['ol']
	> = $props()

	const mergeRanges = (ranges: Iterable<[number, number] | readonly [number, number]>): [number, number][] => {
		const sorted = [...ranges].sort((a, b) => (a[0] - b[0]))
		if (sorted.length === 0) return []
		const out: [number, number][] = []
		let [lo, hi] = sorted[0]
		for (let i = 1; i < sorted.length; i++) {
			const [a, b] = sorted[i]
			if (a <= hi + 1) {
				hi = Math.max(hi, b)
			} else {
				out.push([lo, hi])
				;[lo, hi] = [a, b]
			}
		}
		out.push([lo, hi])
		return out
	}

	const gapsInRange = (
		rangeLo: number,
		rangeHi: number,
		sortedKeys: number[],
	): [number, number][] => {
		const inRange = sortedKeys.filter((k) => (k >= rangeLo && k <= rangeHi))
		if (inRange.length === 0) return [[rangeLo, rangeHi]]
		const gaps: [number, number][] = []
		if (rangeHi > inRange[0]) gaps.push([inRange[0] + 1, rangeHi])
		for (let i = 0; i < inRange.length - 1; i++)
			if (inRange[i] - inRange[i + 1] > 1)
				gaps.push([inRange[i + 1] + 1, inRange[i] - 1])
		if (rangeLo < inRange[inRange.length - 1])
			gaps.push([rangeLo, inRange[inRange.length - 1] - 1])
		return gaps
	}

	const getNumberKey = (item: _Item) => (
		Number(getKey(item))
	)
	const sortedItems = $derived(
		[...items].sort((a, b) => {
			const ka = getNumberKey(a)
			const kb = getNumberKey(b)
			return sortDirection === SortDirection.Desc ?
				kb - ka
			:
				ka - kb
		}),
	)
	const sortedKeys = $derived(sortedItems.map((item) => (getNumberKey(item))))
	const scopeRanges = $derived(mergeRanges(placeholderRanges))
	const gapRanges = $derived.by(() => {
		const out: [number, number][] = []
		for (const [rLo, rHi] of scopeRanges)
			out.push(...gapsInRange(rLo, rHi, sortedKeys))
		return out
	})
	const summaryTotal = $derived.by(() => {
		let n = 0
		for (const [lo, hi] of scopeRanges) n += hi - lo + 1
		return n > 0 ? n : undefined
	})
	$effect(() => {
		summary = {
			loaded: items.size,
			total: summaryTotal,
		}
	})
	const itemRows = $derived(
		sortedItems.map(
			(item): Row => ({
				type: OrderedListRowType.Item,
				key: getNumberKey(item),
				item,
			}),
		),
	)
	const rangeRows = $derived(
		gapRanges.map(
			([lo, hi]): Row => ({
				type: OrderedListRowType.Range,
				range: [lo, hi],
			}),
		),
	)
	const orderKey = (r: Row) => (
		r.type === OrderedListRowType.Item ?
			r.key
		:
			r.range[1]
	)
	let allRows = $derived.by(() => (
		[...itemRows, ...rangeRows].sort((a, b) => (
			sortDirection === SortDirection.Desc ?
				orderKey(b) - orderKey(a)
			:
				orderKey(a) - orderKey(b)
		))
	))


	// Transitions/animations
	import { createViewTransition } from '$/lib/viewTransition.ts'

	const allRowsViewTransition = createViewTransition()
	let committedAllRows = $state(null as Row[] | null)
	$effect(() => {
		const next = allRows
		if (committedAllRows === null) {
			committedAllRows = next
			return
		}
		if (next === committedAllRows) return
		allRowsViewTransition.schedule(() => {
			committedAllRows = next
		})
	})
	const displayAllRows = $derived(committedAllRows ?? allRows)
	const isEmpty = $derived(allRows.length === 0)
	const sliceLimit = $derived(
		sliceLimitProp ?? (onLoadMorePlaceholders ? 200 : 100),
	)

	let visibleItemKeys = $state(new Set<number>())
	const setItemVisible = (key: number, visible: boolean) => {
		visibleItemKeys = (() => {
			const next = new Set(visibleItemKeys)
			if (visible) next.add(key)
			else next.delete(key)
			return next
		})()
	}
	let visibleRangeStarts = $state(new Set<string>())
	let visibleRangeEnds = $state(new Set<string>())
	const getRangeKey = (lo: number, hi: number) => `${lo}-${hi}`

	const setRangeStartVisible = (key: string, visible: boolean) => {
		visibleRangeStarts = (() => {
			const next = new Set(visibleRangeStarts)
			if (visible) next.add(key)
			else next.delete(key)
			return next
		})()
	}
	const setRangeEndVisible = (key: string, visible: boolean) => {
		visibleRangeEnds = (() => {
			const next = new Set(visibleRangeEnds)
			if (visible) next.add(key)
			else next.delete(key)
			return next
		})()
	}
</script>


{#if isEmpty && Empty}
	<div data-empty>
		{@render Empty()}
	</div>
{:else}
	<ol
		class="list anchor-{scrollPosition.toLowerCase()}"
		class:many-items={displayAllRows.length > 200}
		data-list="unstyled"
		data-sticky-container
		{...olProps}
	>
		{#each displayAllRows.slice(0, sliceLimit) as row, index (
			row.type === OrderedListRowType.Item ? row.key : `range:${row.range[0]}-${row.range[1]}`
		)}
			{#if row.type === OrderedListRowType.Item}
				<li
					data-list-item
					data-scroll-item="snap-block-start"
					style:--index={index}
					{@attach visibility({
						onChange: (visible) => setItemVisible(row.key, visible),
					})}
				>
					{@render Item({
						key: row.key,
						item: row.item,
						isPlaceholder: false as const,
						isVisible: visibleItemKeys.has(row.key),
					})}
				</li>
			{:else if row.type === OrderedListRowType.Range}
				{@const [lo, hi] = row.range}
				{@const rangeKey = getRangeKey(lo, hi)}

				<li
					data-list-item
					data-placeholder-range
					data-scroll-item="snap-block-start"
					style:--index={index}
					class="range-row"
					{@attach visibility({
						onVisible: () => {
							if (!visiblePlaceholderRanges.has(rangeKey))
								visiblePlaceholderRanges = new Set([
									...visiblePlaceholderRanges,
									rangeKey,
								])
						},
					})}
				>
					{#if PlaceholderRange}
						{@render PlaceholderRange({
							range: row.range,
							isVisibleStart: visibleRangeStarts.has(rangeKey),
							isVisibleEnd: visibleRangeEnds.has(rangeKey),
						})}
					{/if}
				</li>
			{/if}
		{/each}

		{#if pagination?.hasMore}
			<li
				data-list-item
				data-pagination
				data-scroll-item="snap-block-start"
				{@attach visibility({ onVisible: pagination?.onLoadMore ?? (() => {}) })}
			>
				{#if pagination?.Placeholder}
					{@render pagination.Placeholder({
						loading: pagination.loading ?? false,
					})}
				{:else}
					<code data-text="muted">
						{(pagination?.loading ?? false) ?
							'Loading…'
						:
							(pagination?.label ?? 'Load more')}
					</code>
				{/if}
			</li>
		{/if}

		{#if onLoadMorePlaceholders}
			<li
				data-list-item
				data-placeholder-sentinel
				data-scroll-item="snap-block-start"
				{@attach visibility({ onVisible: onLoadMorePlaceholders ?? (() => {}) })}
			>
				<span aria-hidden="true">&nbsp;</span>
			</li>
		{/if}
	</ol>
{/if}


<style>
	.list {
		> li {
			view-transition-name: var(--index);

			display: grid;
			max-block-size: 80vh;
		}

		> li.range-row {
			display: flex;
			flex-direction: column;
		}

		&.anchor-start {
			> li:first-child {
				overflow-anchor: auto;
			}
		}
		&.anchor-end {
			> li:last-child {
				overflow-anchor: auto;
			}
		}
		&.many-items {
			> li {
				content-visibility: auto;
				contain-intrinsic-block-size: 0 60px;
			}
		}
	}
</style>
