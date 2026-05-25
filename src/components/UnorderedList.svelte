<script
	module
	lang="ts"
>
</script>


<script
	lang="ts"
	generics="
		_Item,
		_Key extends string | number = string | number,
		_GroupKey extends string | number = string | number
	"
>
	// Types/constants
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { UnorderedListRowType } from '$/components/UnorderedListRowType.ts'
	import type { ListPagination } from '$/components/RefinableList.types.ts'
	import type { Match } from '$/lib/string.ts'
	import type { VirtualRowMeasurement } from '$/lib/virtualRows.ts'
	import type { Snippet } from 'svelte'
	import { browser } from '$app/environment'
	import { tick } from 'svelte'
	import { SvelteMap, SvelteSet } from 'svelte/reactivity'

	import { createSerialViewTransitionRunner, supportsViewTransitions, viewTransitionName } from '$/lib/viewTransition.ts'
	import { getVisibleVirtualRange, measureVirtualRows } from '$/lib/virtualRows.ts'
	import { visibility } from '$/lib/visibility.ts'

	type GroupRow = {
		type: UnorderedListRowType.Group
		groupKey: _GroupKey
	}
	type ItemRow = {
		type: UnorderedListRowType.Item
		key: _Key
		item: _Item
		isPlaceholder: false
	}
	type PlaceholderRow = {
		type: UnorderedListRowType.Placeholder
		key: _Key
		isPlaceholder: true
	}
	type PaginationRow = {
		type: UnorderedListRowType.Pagination
		key: '__pagination__'
	}
	type PlaceholderSentinelRow = {
		type: UnorderedListRowType.PlaceholderSentinel
		key: '__placeholder_sentinel__'
	}
	type ListRow =
		| GroupRow
		| ItemRow
		| PlaceholderRow
		| PaginationRow
		| PlaceholderSentinelRow
	type RenderItemRow = ItemRow & {
		hidden: boolean
		matches?: SvelteSet<Match>
		searchQuery: string
		visualOrder?: number
	}
	type RenderRow =
		| GroupRow
		| RenderItemRow
		| PlaceholderRow
		| PaginationRow
		| PlaceholderSentinelRow
	type RenderState = {
		empty: boolean
		hasVirtual: boolean
		manyItems: boolean
		rows: RenderRow[]
	}
	type ItemsInput = Iterable<_Item>

	type GroupHeaderSnippetContext = {
		groupKey?: _GroupKey,
	}

	type ItemSnippetContext = {
		key?: _Key,
		item: _Item,
		searchQuery?: string,
		matches?: SvelteSet<Match>,
	}

	type ItemPlaceholderSnippetContext = {
		key: _Key,
	}


	// Props
	let {
		items = $bindable(new SvelteSet()),
		getKey,
		getSortValue,
		getIsHidden,
		getGroupKey,
		getGroupLabel,
		getGroupKeyForPlaceholder,
		summary = $bindable({ loaded: 0, total: undefined }),
		visiblePlaceholderKeys = $bindable<_Key[]>([]),
		onLoadMorePlaceholders,
		limit,
		placeholderKeys = new SvelteSet<_Key>(),
		scrollPosition = 'Auto',
		listElement = 'ul',
		orientation = ListOrientation.Column,
		pagination,
		listViewTransition = false,
		searchQuery = $bindable(''),
		matchesForItem = $bindable(
			new SvelteMap<_Item, SvelteSet<Match>>()
		),
		virtual,
		GroupHeader,
		Item,
		ItemPlaceholder,
		Empty,
		...rootProps
	}: {
		items: ItemsInput
		getKey: (item: _Item) => _Key
		getSortValue?: (item: _Item) => number | string
		getIsHidden?: (item: _Item) => boolean
		getGroupKey?: (item: _Item) => _GroupKey
		getGroupLabel?: (groupKey: _GroupKey) => string
		getGroupKeyForPlaceholder?: (key: _Key) => _GroupKey
		summary?: { loaded: number; total?: number }
		visiblePlaceholderKeys?: _Key[]
		onLoadMorePlaceholders?: () => void
		limit?: number
		placeholderKeys?: Set<_Key>
		scrollPosition?: 'Start' | 'End' | 'Auto'
		listElement?: 'ul' | 'ol'
		orientation?: ListOrientation
		pagination?: ListPagination
		listViewTransition?: boolean
		searchQuery?: string
		matchesForItem?: SvelteMap<_Item, SvelteSet<Match>>
		virtual?: VirtualRowMeasurement<ListRow>
		GroupHeader?: Snippet<[context?: GroupHeaderSnippetContext]>
		Item: Snippet<[context?: ItemSnippetContext]>
		ItemPlaceholder?: Snippet<[context?: ItemPlaceholderSnippetContext]>
		Empty?: Snippet<[]>
	} = $props()


	// Functions
	const isPlaceholderKey = (key: _Key): boolean => placeholderKeys.has(key)
	const getRowBaseKey = (row: ListRow): string => (
		isGroupRow(row) ?
			`group:${row.groupKey}`
		:
			String(row.key)
	)
	const getRowKey = (row: ListRow, index: number): string => (
		`${getRowBaseKey(row)}:${index}`
	)
	const getVirtualViewport = (element: HTMLElement) => {
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
	const isGroupRow = (row: ListRow): row is GroupRow => (
		row.type === UnorderedListRowType.Group
	)
	const isItemRow = (row: ListRow): row is ItemRow => (
		row.type === UnorderedListRowType.Item
	)
	const isPlaceholderRow = (row: ListRow): row is PlaceholderRow => (
		row.type === UnorderedListRowType.Placeholder
	)
	const isPaginationRow = (row: ListRow): row is PaginationRow => (
		row.type === UnorderedListRowType.Pagination
	)
	const isPlaceholderSentinelRow = (row: ListRow): row is PlaceholderSentinelRow => (
		row.type === UnorderedListRowType.PlaceholderSentinel
	)
	const getMatchFingerprint = (matches: SvelteSet<Match> | undefined) => (
		matches ?
			[...matches].map((match) => `${match.start}-${match.end}`).join(',')
		:
			''
	)
	const buildRenderRows = (
		rows: ListRow[],
		useVisualFilters: boolean,
	): RenderRow[] => (
		rows.map((row): RenderRow => {
			if (!isItemRow(row)) return row

			const matches = matchesForItem.get(row.item)
			const useSearchVisuals = useVisualFilters && hasSearch && hasSearchData
			const hasNoSearchMatches = useSearchVisuals && (matches?.size ?? 0) === 0
			const hidden = (
				(useVisualFilters && getIsHidden ? getIsHidden(row.item) : false)
				|| hasNoSearchMatches
			)

			return {
				...row,
				hidden,
				matches: useSearchVisuals ? matches : undefined,
				searchQuery: useSearchVisuals ? searchQuery : '',
				visualOrder: (
					useSearchVisuals ?
						matchOrder.indexOf(row.item) + 1
					:
						undefined
				),
			}
		})
	)
	const getRenderRowFingerprint = (row: RenderRow): string => (
		isGroupRow(row) ?
			`g:${String(row.groupKey)}`
		: isPlaceholderRow(row) ?
			`p:${String(row.key)}`
		: isPaginationRow(row) ?
			'pg'
		: isPlaceholderSentinelRow(row) ?
			'ps'
		:
			[
				'i',
				String(row.key),
				row.hidden ? '1' : '0',
				String(row.visualOrder ?? ''),
				getMatchFingerprint(row.matches),
			].join(':')
	)
	const getNextRenderState = (): RenderState => (
		hasVirtual ?
			{
				empty: isEmpty,
				hasVirtual: true,
				manyItems: false,
				rows: buildRenderRows(virtualRows, false),
			}
		:
			{
				empty: isEmpty,
				hasVirtual: false,
				manyItems: allRows.length > 200,
				rows: [
					...buildRenderRows(
						allRows.slice(
							0,
							rowLimit,
						),
						true,
					),
					...(
						onLoadMorePlaceholders ?
							[{
								type: UnorderedListRowType.PlaceholderSentinel,
								key: '__placeholder_sentinel__',
							} satisfies RenderRow]
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
			...renderState.rows.map(getRenderRowFingerprint),
		].join('\u001f')
	)
	const buildGroupEntries = (rows: _Item[]) => {
		if (!getGroupKey || !getGroupLabel) return null
		const groupMap = new Map<_GroupKey, _Item[]>()
		for (const item of rows) {
			const groupKey = getGroupKey(item)
			const groupItems = groupMap.get(groupKey)
			if (groupItems) groupItems.push(item)
			else groupMap.set(
				groupKey,
				[item],
			)
		}
		return [...groupMap.entries()]
	}
	const buildPlaceholderRows = (itemKeys: Set<_Key>): ListRow[] => {
		const rows: ListRow[] = []
		for (const key of visiblePlaceholderKeys)
			if (isPlaceholderKey(key) && !itemKeys.has(key))
				rows.push({
					type: UnorderedListRowType.Placeholder,
					key,
					isPlaceholder: true as const,
				})
		return rows
	}
	const buildRows = ({
		groupEntries,
		itemsToRender,
		placeholderRows,
		includePagination,
		includePlaceholderSentinel,
	}: {
		groupEntries: [_GroupKey, _Item[]][] | null
		itemsToRender: _Item[]
		placeholderRows: ListRow[]
		includePagination: boolean
		includePlaceholderSentinel: boolean
	}): ListRow[] => {
		if (
			getGroupKey &&
			getGroupLabel &&
			getGroupKeyForPlaceholder &&
			groupEntries != null
		) {
			const placeholderByGroup = new Map<_GroupKey, _Key[]>()
			for (const row of placeholderRows) {
				if (!isPlaceholderRow(row)) continue
				const groupKey = getGroupKeyForPlaceholder(row.key)
				const groupPlaceholders = placeholderByGroup.get(groupKey)
				if (groupPlaceholders) groupPlaceholders.push(row.key)
				else placeholderByGroup.set(
					groupKey,
					[row.key],
				)
			}
			const groupKeys = new Set<_GroupKey>([
				...groupEntries.map(([groupKey]) => groupKey),
				...placeholderByGroup.keys(),
			])
			const maxBlockInGroup = (groupKey: _GroupKey) => (
				Math.max(
					...(groupEntries.find(([currentGroupKey]) => currentGroupKey === groupKey)?.[1]?.map((item) => (
						getSortValue === undefined ? 0 : -Number(getSortValue(item))
					)) ?? []),
					...(placeholderByGroup.get(groupKey)?.map((key) => Number(key)) ?? []),
				)
			)
			return [
				...[...groupKeys]
					.sort((groupKeyA, groupKeyB) => (
						maxBlockInGroup(groupKeyB) - maxBlockInGroup(groupKeyA)
					))
					.flatMap((groupKey): ListRow[] => {
						const placeholderRowsForGroup = (placeholderByGroup.get(groupKey) ?? [])
							.sort((keyA, keyB) => Number(keyB) - Number(keyA))
							.map((key): ListRow => ({
								type: UnorderedListRowType.Placeholder,
								key,
								isPlaceholder: true as const,
							}))
						return [
							{ type: UnorderedListRowType.Group, groupKey },
							...(groupEntries.find(([currentGroupKey]) => currentGroupKey === groupKey)?.[1]?.map(
								(item): ListRow => ({
									type: UnorderedListRowType.Item,
									key: getKey(item),
									item,
									isPlaceholder: false as const,
								}),
							) ?? []),
							...placeholderRowsForGroup,
						]
					}),
				...(
					includePagination ?
						[{ type: UnorderedListRowType.Pagination, key: '__pagination__' } satisfies ListRow]
					:
						[]
				),
				...(
					includePlaceholderSentinel ?
						[{ type: UnorderedListRowType.PlaceholderSentinel, key: '__placeholder_sentinel__' } satisfies ListRow]
					:
						[]
				),
			]
		}
		return [
			...itemsToRender.map((item): ListRow => ({
				type: UnorderedListRowType.Item,
				key: getKey(item),
				item,
				isPlaceholder: false as const,
			})),
			...placeholderRows,
			...(
				includePagination ?
					[{ type: UnorderedListRowType.Pagination, key: '__pagination__' } satisfies ListRow]
				:
					[]
			),
			...(
				includePlaceholderSentinel ?
					[{ type: UnorderedListRowType.PlaceholderSentinel, key: '__placeholder_sentinel__' } satisfies ListRow]
				:
					[]
			),
		]
	}


	// State
	let listEl: HTMLElement | undefined = $state()
	let virtualMeasureWidth = $state(0)
	let virtualScrollTop = $state(0)
	let virtualViewportHeight = $state(0)
	let rowHeights = $state<number[]>([])
	let offsets = $state<number[]>([
		0,
	])
	let totalHeight = $state(0)
	let scheduledRenderFingerprint = $state<string | null>(null)
	let transitionsArmed = $state(false)
	let transitionsArmScheduled = false


	// (Derived)
	const hasVirtual = $derived(
		browser && virtual !== undefined
	)
	const sortedItems = $derived(
		getSortValue === undefined ?
			[...items]
		:	[...items].sort((itemA, itemB) => {
				const sortValueA = getSortValue(itemA)
				const sortValueB = getSortValue(itemB)
				return sortValueA < sortValueB ?
					-1
				: sortValueA > sortValueB ?
					1
				:
					0
			})
	)
	const searchQueryNormalized = $derived(
		searchQuery.trim().toLowerCase()
	)
	const hasSearch = $derived(
		!!searchQueryNormalized
	)
	const hasSearchData = $derived(
		!hasSearch || sortedItems.every((item) => matchesForItem.has(item))
	)
	const matchOrder = $derived(
		hasSearch ?
			(() => {
				const score = (matches: SvelteSet<Match> | undefined) => {
					if (!matches?.size) return { total: 0, spans: 0, minStart: Infinity, spread: Infinity }
					const rows = [...matches]
					const total = rows.reduce((sum, match) => (sum + (match.end - match.start)), 0)
					const minStart = Math.min(...rows.map((match) => match.start))
					const maxEnd = Math.max(...rows.map((match) => match.end))
					return {
						total,
						spans: matches.size,
						minStart,
						spread: maxEnd - minStart,
					}
				}

				return [...sortedItems].sort((itemA, itemB) => {
					const scoreA = score(matchesForItem.get(itemA))
					const scoreB = score(matchesForItem.get(itemB))
					if (scoreB.total !== scoreA.total) return scoreB.total - scoreA.total
					if (scoreA.spans !== scoreB.spans) return scoreA.spans - scoreB.spans
					if (scoreA.minStart !== scoreB.minStart) return scoreA.minStart - scoreB.minStart
					if (scoreA.spread !== scoreB.spread) return scoreA.spread - scoreB.spread
					if (getSortValue === undefined) return 0
					return getSortValue(itemA) < getSortValue(itemB) ?
						-1
					: getSortValue(itemA) > getSortValue(itemB) ?
						1
					:
						0
				})
			})()
		:
			[]
	)
	const rowLimit = $derived(
		limit ?? (onLoadMorePlaceholders ? 200 : 100)
	)
	const summaryTotal = $derived.by(() => (
		placeholderKeys.size > 0 ? placeholderKeys.size : undefined
	))
	const itemKeys = $derived(
		new Set(sortedItems.map((item) => getKey(item)))
	)
	const placeholderRows = $derived.by(() => (
		buildPlaceholderRows(itemKeys)
	))
	const allRows = $derived.by(() => (
		buildRows({
			groupEntries: buildGroupEntries(sortedItems),
			itemsToRender: sortedItems,
			placeholderRows,
			includePagination: !!pagination?.hasMore,
			includePlaceholderSentinel: false,
		})
	))
	const virtualItems = $derived.by(() => {
		const baseItems = hasSearch && hasSearchData ?
			matchOrder.filter((item) => (
				(matchesForItem.get(item)?.size ?? 0) > 0
			))
		:
			sortedItems
		return baseItems.filter((item) => (
			getIsHidden ? !getIsHidden(item) : true
		))
	})
	const virtualItemKeys = $derived(
		new Set(virtualItems.map((item) => getKey(item)))
	)
	const virtualPlaceholderRows = $derived.by(() => (
		buildPlaceholderRows(virtualItemKeys)
	))
	const virtualRows = $derived.by(() => (
		buildRows({
			groupEntries: buildGroupEntries(virtualItems),
			itemsToRender: virtualItems,
			placeholderRows: virtualPlaceholderRows,
			includePagination: !!pagination?.hasMore,
			includePlaceholderSentinel: !!onLoadMorePlaceholders,
		})
	))
	const isEmpty = $derived(
		allRows.filter((row) => !isPaginationRow(row)).length === 0
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
	const renderIsEmpty = $derived(
		committedRenderState.empty
	)
	const renderManyItems = $derived(
		committedRenderState.manyItems
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
		summary = {
			loaded: sortedItems.length,
			total: summaryTotal,
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
</script>


{#snippet RowItem(
	row: RenderRow,
	index: number,
	rowHeight: number | undefined = undefined,
)}
	{#if isGroupRow(row)}
		<li
			data-list-item
			data-sticky
			data-scroll-item="snap-block-start"
			style:--index={index}
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
		>
			{#if GroupHeader}
				{@render GroupHeader({ groupKey: row.groupKey })}
			{:else}
				{getGroupLabel!(row.groupKey)}
			{/if}
		</li>
	{:else if isPlaceholderRow(row)}
		<li
			data-list-item
			data-placeholder
			data-scroll-item="snap-block-start"
			style:--index={index}
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
		>
			{#if ItemPlaceholder}
				{@render ItemPlaceholder({ key: row.key })}
			{:else}
				<span aria-hidden="true">&nbsp;</span>
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
				{@render pagination.Placeholder({ loading: pagination.loading ?? false })}
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
	{:else}
		<li
			data-list-item
			data-scroll-item="snap-block-start"
			style:--index={index}
			style={row.visualOrder !== undefined ? `order: ${row.visualOrder}` : undefined}
			style:min-block-size={rowHeight !== undefined ? `${rowHeight}px` : undefined}
			style:view-transition-name={viewTransitionName(row.key)}
			{...row.hidden && {
				hidden: true,
				inert: true,
			}}
		>
			{@render Item({
				key: row.key,
				item: row.item,
				searchQuery: row.searchQuery,
				matches: row.matches,
			})}
		</li>
	{/if}
{/snippet}


{#if renderIsEmpty && Empty}
	{@render Empty()}
{:else}
	<svelte:element
		this={listElement}
		bind:this={listEl}
		class="list anchor-{scrollPosition.toLowerCase()}"
		class:many-items={renderManyItems}
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

			{#each virtualVisibleIndices as rowIndex (getRowKey(renderRows[rowIndex], rowIndex))}
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
			{#each renderRows as row, index (getRowKey(row, index))}
				{@render RowItem(
					row,
					index,
					undefined,
				)}
			{/each}
		{/if}
	</svelte:element>
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
