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
	import { tick } from 'svelte'
	import { SvelteSet } from 'svelte/reactivity'
	import { createSerialViewTransitionRunner, supportsViewTransitions, viewTransitionName } from '$/lib/viewTransition.ts'
	import { getVisibleVirtualRange, measureVirtualRows } from '$/lib/virtualRows.ts'
	import { visibility } from '$/lib/visibility.ts'


	type OrderedListKey = number | bigint | string
	type ItemRow = {
		type: OrderedListRowType.Item
		/** Identity from `getKey` (and `#each` key via {@link eachKeyString}). */
		key: OrderedListKey
		/** Sort + placeholder gaps: `getSortKey` when passed, else `getKey`. */
		sortKey: OrderedListKey
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
	type RenderState = {
		empty: boolean
		hasVirtual: boolean
		manyItems: boolean
		rows: Row[]
	}
	type ItemsInput = Iterable<_Item>

	type ItemSnippetContext = {
		key?: OrderedListKey,
		item: _Item,
		isVisible?: boolean,
	}

	type PlaceholderRangeSnippetContext = {
		range?: [number, number],
		isVisibleStart?: boolean,
		isVisibleEnd?: boolean,
	}


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
			eachKeyString(row.key)
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
	const isStringSortTuple = (
		t: readonly [0 | 2, string | bigint],
	): t is readonly [2, string] => (
		t[0] === 2
	)
	const isBigintSortTuple = (
		t: readonly [0 | 2, string | bigint],
	): t is readonly [0, bigint] => (
		t[0] === 0
	)
	const toOrderedTuple = (k: OrderedListKey): readonly [0, bigint] | readonly [2, string] => (
		typeof k === 'bigint' ?
			[0, k] as const
		: typeof k === 'number' ?
			(
				Number.isFinite(k) ?
					[0, BigInt(Math.trunc(k))] as const
				:
					[2, `${k}`] as const
			)
		:
			[2, k] as const
	)
	const compareOrderedListKeys = (a: OrderedListKey, b: OrderedListKey): number => {
		const ta = toOrderedTuple(a)
		const tb = toOrderedTuple(b)
		if (ta[0] !== tb[0]) return ta[0] - tb[0]
		if (isStringSortTuple(ta) && isStringSortTuple(tb)) return ta[1].localeCompare(tb[1])
		if (isBigintSortTuple(ta) && isBigintSortTuple(tb)) {
			const ca = ta[1]
			const cb = tb[1]
			return (
				ca < cb ?
					-1
				: ca > cb ?
					1
				:
					0
			)
		}
		return 0
	}
	const eachKeyString = (k: OrderedListKey): string => (
		typeof k === 'bigint' ?
			`b:${k.toString()}`
		: typeof k === 'number' ?
			`n:${k}`
		:
			`s:${k}`
	)
	const keyForGapNumeric = (k: OrderedListKey): number | undefined => (
		typeof k === 'number' ?
			(Number.isFinite(k) ? Math.trunc(k) : undefined)
		: typeof k === 'bigint' ?
			(() => {
				const n = Number(k)
				return (
					Number.isSafeInteger(n) && BigInt(n) === k ?
						n
					:
						undefined
				)
			})()
		:
			((t) => (
			t.length === 0 || !/^-?\d+$/.test(t) ?
				undefined
			:
				Number(t)
		))(k.trim())
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
	const getNextRenderState = (): RenderState => (
		hasVirtual ?
			{
				empty: isEmpty,
				hasVirtual: true,
				manyItems: false,
				rows: virtualRows,
			}
		:
			{
				empty: isEmpty,
				hasVirtual: false,
				manyItems: allRows.length > 200,
				rows: [
					...allRows.slice(
						0,
						rowLimit,
					),
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
				],
			}
	)
	const getRenderFingerprint = (renderState: RenderState): string => (
		[
			renderState.hasVirtual ? 'v' : 'n',
			renderState.empty ? 'e' : 'o',
			renderState.manyItems ? 'm' : 's',
			...renderState.rows.map(getRowKey),
		].join('\u001f')
	)


	// State
	let {
		items = $bindable(new Set<_Item>()),
		getKey,
		getSortKey: getSortKeyOption,
		sortDirection = SortDirection.Desc,
		placeholderRanges,
		summary = $bindable({ loaded: 0, total: undefined }),
		visiblePlaceholderRanges = $bindable(new Set<string>()),
		onLoadMorePlaceholders,
		limit,
		scrollPosition = 'Auto',
		orientation = ListOrientation.Column,
		pagination,
		listViewTransition = false,
		virtual,
		Item,
		PlaceholderRange,
		Empty,
		...rootProps
	}: {
		items: ItemsInput
		getKey: (item: _Item) => OrderedListKey
		/** When `getKey` is not a good sort key (e.g. string id) but items still sort by number/bigint. */
		getSortKey?: (item: _Item) => OrderedListKey
		sortDirection?: SortDirection
		placeholderRanges: Iterable<[number, number] | readonly [number, number]>
		summary?: { loaded: number; total?: number }
		visiblePlaceholderRanges?: Set<string>
		onLoadMorePlaceholders?: () => void
		limit?: number
		scrollPosition?: 'Start' | 'End' | 'Auto'
		orientation?: ListOrientation
		pagination?: ListPagination
		listViewTransition?: boolean
		virtual?: VirtualRowMeasurement<Row>
		Item: Snippet<[ItemSnippetContext]>
		PlaceholderRange?: Snippet<[PlaceholderRangeSnippetContext]>
		Empty?: Snippet<[]>
	} = $props()

	const itemSortKey = (item: _Item): OrderedListKey => (
		getSortKeyOption?.(item) ?? getKey(item)
	)


	let listEl: HTMLOListElement | undefined = $state()
	let virtualMeasureWidth = $state(0)
	let virtualScrollTop = $state(0)
	let virtualViewportHeight = $state(0)
	let rowHeights = $state<number[]>([])
	let offsets = $state<number[]>([
		0,
	])
	let totalHeight = $state(0)
	let scheduledRenderFingerprint = $state<string | null>(null)
	let visibleItemKeys = new SvelteSet<string>()
	let visibleRangeStarts = new SvelteSet<string>()
	let visibleRangeEnds = new SvelteSet<string>()
	let transitionsArmed = $state(false)
	let transitionsArmScheduled = false


	const hasVirtual = $derived(
		browser && virtual !== undefined
	)
	const sortedItems = $derived(
		[...items].sort((a, b) => {
			const c = compareOrderedListKeys(itemSortKey(a), itemSortKey(b))
			return sortDirection === SortDirection.Desc ? -c : c
		}),
	)
	const sortedKeys = $derived(
		sortedItems
			.map((item) => keyForGapNumeric(itemSortKey(item)))
			.filter((n): n is number => n !== undefined),
	)
	const scopeRanges = $derived(mergeRanges(placeholderRanges))
	const orderKeyRow = (row: Row): OrderedListKey => (
		isItemRow(row) ?
			row.sortKey
		: isRangeRow(row) ?
			row.range[1]
		:
			0
	)
	const allRows = $derived(
		[
			...sortedItems.map(
				(item): Row => ({
					type: OrderedListRowType.Item,
					key: getKey(item),
					sortKey: itemSortKey(item),
					item,
				}),
			),
			...scopeRanges.flatMap(
				([rLo, rHi]) =>
					gapsInRange(rLo, rHi, sortedKeys)
						.map(
							([lo, hi]): Row => ({
								type: OrderedListRowType.Range,
								range: [lo, hi],
							}),
						)
			),
		]
			.sort((a, b) => {
				const c = compareOrderedListKeys(orderKeyRow(a), orderKeyRow(b))
				return sortDirection === SortDirection.Desc ? -c : c
			})
	)

	const virtualRows = $derived(
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
	)
	const isEmpty = $derived(
		allRows.length === 0 && virtualRows.length === 0,
	)
	const rowLimit = $derived(
		limit ?? (onLoadMorePlaceholders ? 200 : 100)
	)

	const nextRenderState = $derived.by(getNextRenderState)
	const nextRenderFingerprint = $derived(
		getRenderFingerprint(nextRenderState)
	)
	let committedRenderState = $state.raw(getNextRenderState())
	let committedRenderFingerprint = $state(getRenderFingerprint(getNextRenderState()))
	const renderRows = $derived(
		committedRenderState.rows
	)
	const renderHasVirtual = $derived(
		committedRenderState.hasVirtual
	)
	const viewTransitionRunner = createSerialViewTransitionRunner()
	const virtualRange = $derived(
		renderHasVirtual ?
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
		const totalScopeRangeCount = scopeRanges.reduce(
			(total, [lo, hi]) => (
				total + hi - lo + 1
			),
			0,
		)

		summary = {
			loaded: sortedItems.length,
			total: (
				totalScopeRangeCount > 0 ?
					totalScopeRangeCount
				:
					undefined
			),
		}
	})
	$effect(() => {
		const _nextRenderFingerprint = nextRenderFingerprint
		if (
			transitionsArmed
			|| transitionsArmScheduled
		) return

		transitionsArmScheduled = true
		void tick()
			.then(() => tick())
			.then(() => {
				committedRenderState = nextRenderState
				committedRenderFingerprint = nextRenderFingerprint
				transitionsArmed = true
			})
			.finally(() => {
				transitionsArmScheduled = false
			})
	})
	$effect.pre(() => {
		const nextState = nextRenderState
		const nextFingerprint = nextRenderFingerprint
		if (nextFingerprint === committedRenderFingerprint) {
			scheduledRenderFingerprint = null
			return
		}
		if (scheduledRenderFingerprint === nextFingerprint) return

		if (
			!browser
			|| !listViewTransition
			|| !transitionsArmed
			|| !supportsViewTransitions()
		) {
			committedRenderState = nextState
			committedRenderFingerprint = nextFingerprint
			scheduledRenderFingerprint = null
			return
		}

		scheduledRenderFingerprint = nextFingerprint
		void viewTransitionRunner.start(() => {
			committedRenderState = nextState
			committedRenderFingerprint = nextFingerprint
			scheduledRenderFingerprint = null
		})
	})
	$effect(() => {
		if (
			!renderHasVirtual
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
			!renderHasVirtual
			|| !virtual
		) return

		const next = measureVirtualRows({
			rows: renderRows,
			width: virtualMeasureWidth,
			measurement: virtual,
		})
		rowHeights = next.rowHeights
		offsets = next.offsets
		totalHeight = next.totalHeight
	})


	// Actions
	const setItemVisible = (stableKey: string, visible: boolean) => {
		if (visible) visibleItemKeys.add(stableKey)
		else visibleItemKeys.delete(stableKey)
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
			style:view-transition-name={viewTransitionName(eachKeyString(row.key))}
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
			{@attach visibility({
				onChange: (visible) => setItemVisible(eachKeyString(row.key), visible),
			})}
		>
			{@render Item({
				key: row.key,
				item: row.item,
				isVisible: visibleItemKeys.has(eachKeyString(row.key)),
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
			style:view-transition-name={viewTransitionName(
				`r-${row.range[0]}-${row.range[1]}`,
			)}
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
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
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
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
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
			{@attach visibility({ onVisible: onLoadMorePlaceholders ?? (() => {}) })}
		>
			<span aria-hidden="true">&nbsp;</span>
		</li>
	{/if}
{/snippet}


{#if committedRenderState.empty && Empty}
	{@render Empty()}
{:else}
	<ol
		bind:this={listEl}
		class="list anchor-{scrollPosition.toLowerCase()}"
		class:many-items={committedRenderState.manyItems}
		class:virtual={renderHasVirtual}
		data-row={orientation === ListOrientation.Row ? '' : undefined}
		data-column={orientation === ListOrientation.Column ? '' : undefined}
		data-list="unstyled"
		data-sticky-container
		{...rootProps}
	>
		{#if renderHasVirtual}
			{#if topSpacerHeight > 0}
				<li
					aria-hidden="true"
					class="virtual-spacer"
					style:block-size={`${topSpacerHeight}px`}
				></li>
			{/if}

			{#each virtualVisibleIndices as rowIndex (getRowKey(renderRows[rowIndex]))}
				{@render RowItem(
					renderRows[rowIndex],
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
			{#each renderRows as row, index (getRowKey(row))}
				{@render RowItem(row, index)}
			{/each}
		{/if}
	</ol>
{/if}


<style>
	.list {
		> li:not(.virtual-spacer) {
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
