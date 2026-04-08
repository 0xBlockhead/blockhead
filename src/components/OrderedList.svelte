<script
	module
	lang="ts"
>
	import { SortDirection } from '$/lib/sort.ts'

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
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { OrderedListRowType } from '$/components/OrderedListRowType.ts'
	import type { ListPagination } from '$/components/RefinableList.types.ts'
	import type { VirtualRowMeasurement } from '$/lib/virtualRows.ts'
	import type { Snippet } from 'svelte'
	import { browser } from '$app/environment'
	import { SvelteSet } from 'svelte/reactivity'
	import { getVisibleVirtualRange, measureVirtualRows } from '$/lib/virtualRows.ts'
	import { visibility } from '$/lib/visibility.ts'


	type OrderedListKey = number | bigint
	type ItemRow = {
		type: OrderedListRowType.Item
		key: number
		item: _Item
	}
	type RangeRow = {
		type: OrderedListRowType.Range
		range: [number, number]
	}
	type PaginationRow = {
		type: OrderedListRowType.Pagination
	}
	type PlaceholderSentinelRow = {
		type: OrderedListRowType.PlaceholderSentinel
	}
	type Row =
		| ItemRow
		| RangeRow
		| PaginationRow
		| PlaceholderSentinelRow


	// Functions
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
	const getRowKey = (row: Row) => (
		isItemRow(row) ?
			String(row.key)
		: isRangeRow(row) ?
			`range:${row.range[0]}-${row.range[1]}`
		:
			row.type
	)
	const getVirtualViewport = (element: HTMLOListElement) => {
		const listRect = element.getBoundingClientRect()
		const scrollContainer = element.closest('[data-scroll-container]')
		return scrollContainer instanceof HTMLElement ?
			{
				measureWidth: listRect.width,
				scrollTop: Math.max(
					0,
					scrollContainer.getBoundingClientRect().top - listRect.top,
				),
				viewportHeight: scrollContainer.clientHeight,
				target: scrollContainer,
			}
		:
			{
				measureWidth: listRect.width,
				scrollTop: Math.max(
					0,
					-listRect.top,
				),
				viewportHeight: window.innerHeight,
				target: window,
			}
	}
	const getNumberKey = (item: _Item) => (
		Number(getKey(item))
	)
	const getRangeKey = (lo: number, hi: number) => `${lo}-${hi}`
	const isItemRow = (row: Row): row is ItemRow => (
		row.type === OrderedListRowType.Item
	)
	const isRangeRow = (row: Row): row is RangeRow => (
		row.type === OrderedListRowType.Range
	)
	const isPaginationRow = (row: Row): row is PaginationRow => (
		row.type === OrderedListRowType.Pagination
	)
	const isPlaceholderSentinelRow = (row: Row): row is PlaceholderSentinelRow => (
		row.type === OrderedListRowType.PlaceholderSentinel
	)


	// Props
	let {
		items = $bindable(new Set<_Item>()),
		getKey,
		sortDirection = SortDirection.Desc,
		placeholderRanges,
		summary = $bindable({ loaded: 0, total: undefined as number | undefined }),
		visiblePlaceholderRanges = $bindable(new Set<string>()),
		onLoadMorePlaceholders,
		sliceLimit: sliceLimitProp,
		scrollPosition = 'Auto',
		orientation = ListOrientation.Column,
		pagination,
		virtual,
		Item,
		PlaceholderRange,
		Empty,
		...rootProps
	}: {
		items: Set<_Item>
		getKey: (item: _Item) => OrderedListKey
		sortDirection?: SortDirection
		placeholderRanges: Iterable<[number, number] | readonly [number, number]>
		summary?: { loaded: number; total?: number }
		visiblePlaceholderRanges?: Set<string>
		onLoadMorePlaceholders?: () => void
		sliceLimit?: number
		scrollPosition?: 'Start' | 'End' | 'Auto'
		orientation?: ListOrientation
		pagination?: ListPagination
		virtual?: VirtualRowMeasurement<Row>
		Item: Snippet<
			[
				{
					key: number
					isVisible: boolean
				} & (
					| { item: _Item; isPlaceholder: false }
					| { item?: never; isPlaceholder: true }
				),
			]
		>
		PlaceholderRange?: Snippet<[
			{
				range: [number, number]
				isVisibleStart: boolean
				isVisibleEnd: boolean
			},
		]>
		Empty?: Snippet<[]>
		[key: string]: unknown
	} = $props()


	// State
	let listEl: HTMLOListElement | undefined = $state()
	let virtualMeasureWidth = $state(0)
	let virtualScrollTop = $state(0)
	let virtualViewportHeight = $state(0)
	let rowHeights = $state<number[]>([])
	let offsets = $state<number[]>([
		0,
	])
	let totalHeight = $state(0)
	let visibleItemKeys = new SvelteSet<number>()
	let visibleRangeStarts = new SvelteSet<string>()
	let visibleRangeEnds = new SvelteSet<string>()


	// (Derived)
	const hasVirtual = $derived(
		browser && virtual != null
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
	const orderKey = (row: Row) => (
		isItemRow(row) ?
			row.key
		: isRangeRow(row) ?
			row.range[1]
		:
			Infinity
	)
	const allRows = $derived.by((): Row[] => (
		[...itemRows, ...rangeRows].sort((a, b) => (
			sortDirection === SortDirection.Desc ?
				orderKey(b) - orderKey(a)
			:
				orderKey(a) - orderKey(b)
		))
	))
	const virtualRows = $derived.by((): Row[] => (
		[
			...allRows,
			...(
				pagination?.hasMore ?
					[{ type: OrderedListRowType.Pagination } satisfies Row]
				:
					[]
			),
			...(
				onLoadMorePlaceholders ?
					[{ type: OrderedListRowType.PlaceholderSentinel } satisfies Row]
				:
					[]
			),
		]
	))
	const isEmpty = $derived(allRows.length === 0)
	const sliceLimit = $derived(
		sliceLimitProp ?? (onLoadMorePlaceholders ? 200 : 100),
	)
	const virtualRange = $derived(
		hasVirtual ?
			getVisibleVirtualRange({
				offsets,
				scrollTop: virtualScrollTop,
				viewportHeight: virtualViewportHeight,
				overscan: virtual?.overscan,
			})
		:
			{
				start: 0,
				end: -1,
			}
	)
	const virtualVisibleIndices = $derived.by(() => (
		virtualRange.end < virtualRange.start ?
			[]
		:
			Array.from(
				{
					length: virtualRange.end - virtualRange.start + 1,
				},
				(_, index) => (
					virtualRange.start + index
				),
			)
	))
	const topSpacerHeight = $derived(
		virtualVisibleIndices.length > 0 ?
			(offsets[virtualVisibleIndices[0]] ?? 0)
		:
			0
	)
	const bottomSpacerHeight = $derived(
		virtualVisibleIndices.length > 0 ?
			Math.max(
				0,
				totalHeight - (offsets[virtualVisibleIndices.at(-1)! + 1] ?? 0),
			)
		:
			totalHeight
	)

	$effect(() => {
		summary = {
			loaded: items.size,
			total: summaryTotal,
		}
	})
	$effect(() => {
		if (
			!hasVirtual
			|| !listEl
		) return

		const updateViewport = () => {
			if (!listEl) return
			const nextViewport = getVirtualViewport(listEl)
			virtualMeasureWidth = nextViewport.measureWidth
			virtualScrollTop = nextViewport.scrollTop
			virtualViewportHeight = nextViewport.viewportHeight
		}
		const { target } = getVirtualViewport(listEl)
		const resizeObserver = new ResizeObserver(() => {
			updateViewport()
		})
		resizeObserver.observe(listEl)
		if (target instanceof HTMLElement)
			resizeObserver.observe(target)
		else
			window.addEventListener(
				'resize',
				updateViewport,
			)
		target.addEventListener(
			'scroll',
			updateViewport,
			{ passive: true },
		)
		updateViewport()

		return () => {
			resizeObserver.disconnect()
			target.removeEventListener(
				'scroll',
				updateViewport,
			)
			if (!(target instanceof HTMLElement))
				window.removeEventListener(
					'resize',
					updateViewport,
				)
		}
	})
	$effect(() => {
		if (
			!hasVirtual
			|| !virtual
		) return

		const next = measureVirtualRows({
			rows: virtualRows,
			width: virtualMeasureWidth,
			measurement: virtual,
		})
		rowHeights = next.rowHeights
		offsets = next.offsets
		totalHeight = next.totalHeight
	})


	// Actions
	const setItemVisible = (key: number, visible: boolean) => {
		if (visible) visibleItemKeys.add(key)
		else visibleItemKeys.delete(key)
	}
</script>


{#snippet RowItem(
	row: Row,
	index: number,
	rowHeight: number | undefined = undefined,
)}
	{#if isItemRow(row)}
		<li
			data-list-item
			data-scroll-item="snap-block-start"
			style:--index={index}
			style:min-block-size={rowHeight != null ? `${rowHeight}px` : undefined}
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
	{:else if isRangeRow(row)}
		{@const rangeKey = getRangeKey(
			row.range[0],
			row.range[1],
		)}

		<li
			data-list-item
			data-placeholder-range
			data-scroll-item="snap-block-start"
			style:--index={index}
			style:min-block-size={rowHeight != null ? `${rowHeight}px` : undefined}
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
	{:else if isPaginationRow(row)}
		<li
			data-list-item
			data-pagination
			data-scroll-item="snap-block-start"
			style:--index={index}
			style:min-block-size={rowHeight != null ? `${rowHeight}px` : undefined}
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
	{:else if isPlaceholderSentinelRow(row)}
		<li
			data-list-item
			data-placeholder-sentinel
			data-scroll-item="snap-block-start"
			style:--index={index}
			style:min-block-size={rowHeight != null ? `${rowHeight}px` : undefined}
			{@attach visibility({ onVisible: onLoadMorePlaceholders ?? (() => {}) })}
		>
			<span aria-hidden="true">&nbsp;</span>
		</li>
	{/if}
{/snippet}


{#if isEmpty && Empty}
	{@render Empty()}
{:else}
	<ol
		bind:this={listEl}
		class="list anchor-{scrollPosition.toLowerCase()}"
		class:many-items={!hasVirtual && allRows.length > 200}
		class:virtual={hasVirtual}
		data-row={orientation === ListOrientation.Row ? '' : undefined}
		data-column={orientation === ListOrientation.Column ? '' : undefined}
		data-list="unstyled"
		data-sticky-container
		{...rootProps}
	>
		{#if hasVirtual}
			{#if topSpacerHeight > 0}
				<li
					aria-hidden="true"
					class="virtual-spacer"
					style:block-size={`${topSpacerHeight}px`}
				></li>
			{/if}

			{#each virtualVisibleIndices as rowIndex (getRowKey(virtualRows[rowIndex]))}
				{@render RowItem(
					virtualRows[rowIndex],
					rowIndex,
					rowHeights[rowIndex],
				)}
			{/each}

			{#if bottomSpacerHeight > 0}
				<li
					aria-hidden="true"
					class="virtual-spacer"
					style:block-size={`${bottomSpacerHeight}px`}
				></li>
			{/if}
		{:else}
			{#each allRows.slice(0, sliceLimit) as row, index (getRowKey(row))}
				{@render RowItem(row, index)}
			{/each}

			{#if pagination?.hasMore}
				{@render RowItem(
					{ type: OrderedListRowType.Pagination },
					allRows.length,
				)}
			{/if}

			{#if onLoadMorePlaceholders}
				{@render RowItem(
					{ type: OrderedListRowType.PlaceholderSentinel },
					allRows.length + (pagination?.hasMore ? 1 : 0),
				)}
			{/if}
		{/if}
	</ol>
{/if}


<style>
	.list {
		> li:not(.virtual-spacer) {
			view-transition-name: var(--index);

			display: grid;
			max-block-size: 80vh;
		}

		&.virtual {
			gap: 0;
		}

		> li.range-row {
			display: flex;
			flex-direction: column;
		}

		> li.virtual-spacer {
			display: block;
			max-block-size: none;
			min-block-size: 0;
			padding: 0;
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
