<script module lang="ts">
	export enum UnorderedListRowType {
		Group = 'group',
		Item = 'item',
		Placeholder = 'placeholder',
		Pagination = 'pagination',
	}
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
	import type { ListPagination } from '$/components/RefinableList.svelte.ts'
	import type { Match } from '$/lib/fuzzyMatch.ts'


	type ListRow = (
		| {
			type: UnorderedListRowType.Group;
			groupKey: _GroupKey
		}
		| {
			type: UnorderedListRowType.Item
			key: _Key
			item: _Item
			isPlaceholder: false
		}
		| {
			type: UnorderedListRowType.Placeholder
			key: _Key;
			isPlaceholder: true
		}
		| {
			type: UnorderedListRowType.Pagination
			key: '__pagination__'
		}
	)


	// State
	import type { Snippet } from 'svelte'
	import { createViewTransition } from '$/lib/viewTransition.ts'
	import { untrack } from 'svelte'
	import { SvelteMap, SvelteSet } from 'svelte/reactivity'

	let {
		items = $bindable(new SvelteSet()),
		getKey,
		getSortValue,
		getIsHidden,
		getGroupKey,
		getGroupLabel,
		getGroupKeyForPlaceholder,

		placeholderKeys,
		visiblePlaceholderKeys = $bindable([] as _Key[]),
		onLoadMorePlaceholders,
		sliceLimit: sliceLimitProp,

		scrollPosition = 'Auto',
		listElement = 'ul',

		pagination,

		searchQuery = $bindable(''),
		matchesForItem = $bindable(
			new SvelteMap<_Item, SvelteSet<Match>>()
		),

		summary = $bindable({
			loaded: 0,
			total: undefined as number | undefined,
		}),

		GroupHeader,
		Item,
		Empty,

		...ulProps
	}: WithRest<
		{
			items: Set<_Item>
			getKey: (item: _Item) => _Key
			getSortValue: (item: _Item) => number | string
			getIsHidden?: (item: _Item) => boolean
			getGroupKey?: (item: _Item) => _GroupKey
			getGroupLabel?: (groupKey: _GroupKey) => string
			getGroupKeyForPlaceholder?: (key: _Key) => _GroupKey
			
			placeholderKeys: Set<_Key>
			visiblePlaceholderKeys?: _Key[]
			onLoadMorePlaceholders?: () => void
			sliceLimit?: number

			scrollPosition?: 'Start' | 'End' | 'Auto'
			listElement?: 'ul' | 'ol'

			pagination?: ListPagination

			searchQuery?: string
			matchesForItem?: SvelteMap<_Item, SvelteSet<Match>>

			summary?: { loaded: number; total?: number }

			GroupHeader?: Snippet<[{
				groupKey: _GroupKey,
			}]>
			Item: Snippet<[
				{
					key: _Key,
				} & (
					| {
							item: _Item
							isPlaceholder: false
							searchQuery?: string
							matches?: SvelteSet<Match>
						}
					| { item?: never; isPlaceholder: true }
				),
			]>
			Empty?: Snippet
		},
		SvelteHTMLElements['ul']
	> = $props()

	const isPlaceholderKey = (key: _Key): boolean => (
		placeholderKeys.has(key)
	)
	const viewTransitionName = (key: _Key): string => (
		'list-item-' + String(key).replace(/^\d/, '_$&').replace(/[^a-zA-Z0-9_-]/g, '_')
	)


	// (Derived)
	const sortedItems = $derived(
		[...items].sort((itemA, itemB) => {
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
	$effect(() => {
		const query = searchQueryNormalized
		const _itemsSize = items.size
		if (!query) {
			untrack(() => matchesForItem.clear())
			return
		}
		untrack(() => {
			for (const item of sortedItems) {
				if (!matchesForItem.has(item)) matchesForItem.set(item, new SvelteSet())
			}
		})
	})
	const itemsToShow = $derived(
		sortedItems
	)
	const matchOrder = $derived(
		hasSearch ?
			(() => {
				const score = (ms: SvelteSet<Match> | undefined) => {
					if (!ms?.size) return { total: 0, spans: 0, minStart: Infinity, spread: Infinity }
					const arr = [...ms]
					const total = arr.reduce((s, m) => s + (m.end - m.start), 0)
					const minStart = Math.min(...arr.map((m) => m.start))
					const maxEnd = Math.max(...arr.map((m) => m.end))
					return {
						total,
						spans: ms.size,
						minStart,
						spread: maxEnd - minStart,
					}
				}

				return [...sortedItems].sort((a, b) => {
					const sa = score(matchesForItem.get(a))
					const sb = score(matchesForItem.get(b))
					if (sb.total !== sa.total) return sb.total - sa.total
					if (sa.spans !== sb.spans) return sa.spans - sb.spans
					if (sa.minStart !== sb.minStart) return sa.minStart - sb.minStart
					if (sa.spread !== sb.spread) return sa.spread - sb.spread
					return getSortValue(a) < getSortValue(b) ?
							-1
						: getSortValue(a) > getSortValue(b) ?
							1
						:
							0
				})
			})()
		:
			[]
	)

	const matchOrderViewTransition = createViewTransition()
	let committedMatchOrder = $state([] as _Item[])
	$effect(() => {
		const next = matchOrder
		matchOrderViewTransition.schedule(() => {
			committedMatchOrder = next
		})
	})

	const sliceLimit = $derived(
		sliceLimitProp ??
			(onLoadMorePlaceholders ? 200 : 100),
	)
	// (Derived) — split steps, ~two inputs per derived
	const summaryTotal = $derived.by(() => (
		placeholderKeys.size > 0 ? placeholderKeys.size : undefined
	))
	$effect(() => {
		summary = {
			loaded: items.size,
			total: summaryTotal,
		}
	})
	const itemKeys = $derived(new Set(itemsToShow.map((item) => getKey(item))))
	const groupEntries = $derived.by(() => {
		if (!getGroupKey || !getGroupLabel) return null
		const groupMap = new Map<_GroupKey, _Item[]>()
		for (const item of itemsToShow) {
			const g = getGroupKey(item)
			let arr = groupMap.get(g)
			if (!arr) groupMap.set(g, (arr = []))
			arr.push(item)
		}
		return [...groupMap.entries()]
	})
	const itemRows = $derived.by((): ListRow[] =>
		groupEntries
			? groupEntries.flatMap(([groupKey, groupItems]): ListRow[] => [
					{ type: UnorderedListRowType.Group, groupKey },
					...(groupItems ?? []).map((item): ListRow => ({
						type: UnorderedListRowType.Item,
						key: getKey(item),
						item,
						isPlaceholder: false as const,
					})),
				])
			: itemsToShow.map((item): ListRow => ({
					type: UnorderedListRowType.Item,
					key: getKey(item),
					item,
					isPlaceholder: false as const,
				})),
	)
	const placeholderRows = $derived.by(() => {
		const out: ListRow[] = []
		for (const key of visiblePlaceholderKeys)
			if (isPlaceholderKey(key) && !itemKeys.has(key))
				out.push({
					type: UnorderedListRowType.Placeholder,
					key,
					isPlaceholder: true as const,
				})
		return out
	})
	const isEmpty = $derived(
		itemRows.length === 0 && placeholderRows.length === 0,
	)
	const placeholderByGroup = $derived.by(() => {
		if (!getGroupKeyForPlaceholder) return new Map<_GroupKey, _Key[]>()
		const map = new Map<_GroupKey, _Key[]>()
		for (const row of placeholderRows) {
			if (row.type !== UnorderedListRowType.Placeholder) continue
			const g = getGroupKeyForPlaceholder(row.key)
			const arr = map.get(g) ?? []
			arr.push(row.key)
			map.set(g, arr)
		}
		return map
	})
	const groupOrder = $derived.by(() => {
		if (groupEntries == null) return []
		const groupKeys = new Set<_GroupKey>([
			...groupEntries.map(([k]) => k),
			...placeholderByGroup.keys(),
		])
		const maxBlockInGroup = (g: _GroupKey) => (
			Math.max(
				...(groupEntries.find(([k]) => k === g)?.[1]?.map((i) => -Number(getSortValue(i))) ?? []),
				...(placeholderByGroup.get(g)?.map((k) => Number(k)) ?? []),
			)
		)
		return [...groupKeys].sort(
			(ga, gb) => maxBlockInGroup(gb) - maxBlockInGroup(ga),
		)
	})
	const allRows = $derived.by((): ListRow[] => {
		if (
			getGroupKey &&
			getGroupLabel &&
			getGroupKeyForPlaceholder &&
			groupEntries != null
		) {
			return [
				...groupOrder.flatMap((groupKey): ListRow[] => {
					const placeholders = placeholderByGroup.get(groupKey) ?? []
					const placeholderRowsForGroup: ListRow[] = placeholders
						.sort((a, b) => Number(b) - Number(a))
						.map(
							(key): ListRow => ({
								type: UnorderedListRowType.Placeholder,
								key,
								isPlaceholder: true as const,
							}),
						)
					return [
						{ type: UnorderedListRowType.Group, groupKey },
						...(groupEntries.find(([k]) => k === groupKey)?.[1]?.map(
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
					pagination?.hasMore ?
						[{ type: UnorderedListRowType.Pagination, key: '__pagination__' } as ListRow]
					: []
				),
			]
		}
		return [
			...itemRows,
			...placeholderRows,
			...(
				pagination?.hasMore ?
					[{ type: UnorderedListRowType.Pagination, key: '__pagination__' } as ListRow]
				: []
			),
		]
	})


	// Functions
	import { visibility } from '$/svelte/visibility.svelte.ts'
</script>


{#if isEmpty && Empty}
	<div data-empty>
		{@render Empty()}
	</div>
{:else}
	<svelte:element
		this={listElement}
		class="list anchor-{scrollPosition.toLowerCase()}"
		class:many-items={allRows.length > 200}
		data-list="unstyled"
		data-sticky-container
		{...ulProps}
	>
		{#each allRows.slice(0, sliceLimit) as item, index (
			item.type === UnorderedListRowType.Group ?
				`group:${item.groupKey}`
			:
				item.key
		)}
			{#if item.type === UnorderedListRowType.Group}
				<li
					data-list-item
					data-sticky
					data-scroll-item="snap-block-start"
					style:--index={index}
				>
					{#if GroupHeader}
						{@render GroupHeader({
							groupKey: item.groupKey,
						})}
					{:else}
						{getGroupLabel!(item.groupKey)}
					{/if}
				</li>
			{:else if item.type === UnorderedListRowType.Placeholder}
				<li
					data-list-item
					data-placeholder
					data-scroll-item="snap-block-start"
					style:--index={index}
				>
					{@render Item({
						key: item.key,
						isPlaceholder: true as const,
					})}
				</li>
			{:else if item.type === UnorderedListRowType.Pagination}
				<li
					data-list-item
					data-pagination
					data-scroll-item="snap-block-start"
					style:--index={index}
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
			{:else}
				{@const hasNoSearchMatches = hasSearch && (matchesForItem.get(item.item)?.size ?? 0) === 0}

				{@const isHidden = getIsHidden ? getIsHidden(item.item) : false}

				{@const visualOrder = hasSearch ? committedMatchOrder.indexOf(item.item) + 1 : undefined}

				<li
					data-list-item
					data-scroll-item="snap-block-start"
					style:--index={index}
					style={visualOrder != null ? `order: ${visualOrder}` : undefined}
					style:view-transition-name={viewTransitionName(item.key)}
					{...(isHidden || hasNoSearchMatches) && {
						hidden: true,
						inert: true,
					}}
				>
					{@render Item({
						key: item.key,
						item: item.item,
						isPlaceholder: false as const,
						searchQuery,
						matches: matchesForItem.get(item.item),
					})}
				</li>
			{/if}
		{/each}
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
	</svelte:element>
{/if}


<style>
	.list {
		> li {
			display: grid;
			max-block-size: 80vh;
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
