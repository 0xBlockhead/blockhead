<script module lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	export type ListPagination = {
		hasMore: boolean
		onLoadMore: () => void
		loading?: boolean
		label?: string
		Placeholder?: Snippet<[context?: {
			loading?: boolean,
		}]>
	}

	export enum FilterDisplayType {
		Select = 'Select',
		Combobox = 'Combobox',
		Options = 'Options',
		Snippet = 'Snippet',
	}

	export enum FilterOperation {
		Union = 'Union',
		Intersection = 'Intersection',
	}

	export type Filter<_Item, _FilterId extends string = string> = {
		id: _FilterId
		label: string
		icon?: string
		filterFunction?: (item: _Item) => boolean
	}

	type FilterGroupSelection<_FilterId extends string = string> =
		| { exclusive: true, defaultFilter?: _FilterId }
		| { exclusive: false, defaultFilters?: _FilterId[] }

	type FilterGroupBase<_Item, _FilterId extends string = string> = {
		id: string
		label: string
		operation?: FilterOperation
		filters: Filter<_Item, _FilterId>[]
		FilterLabelSnippet?: import('svelte').Snippet<[Filter<_Item, _FilterId>]>
	}

	export type FilterGroupSnippetProps<_Item, _FilterId extends string = string> = {
		group: FilterGroup<_Item, _FilterId>
		visibleFilters: Filter<_Item, _FilterId>[]
		bindValue: [() => _FilterId | '', (value: _FilterId | '') => void]
		bindValueIds: [() => _FilterId[], (values: _FilterId[]) => void]
	}

	export type FilterGroup<_Item, _FilterId extends string = string> =
		| (FilterGroupBase<_Item, _FilterId> &
				FilterGroupSelection<_FilterId> & {
					displayType: FilterDisplayType.Snippet
					Snippet: import('svelte').Snippet<[context?: FilterGroupSnippetProps<_Item, _FilterId>]>
				})
		| (FilterGroupBase<_Item, _FilterId> &
				FilterGroupSelection<_FilterId> & {
					displayType?: Exclude<FilterDisplayType, FilterDisplayType.Snippet>
				})

	export type Sort<_Item, _SortId extends string = string> = {
		id: _SortId
		label: string
		compare: (a: _Item, b: _Item) => number
	}
</script>


<script
	lang="ts"
	generics="
		_Item,
		_Key extends string | number = string | number,
		_GroupKey extends string | number = string | number,
		_FilterId extends string = string,
		_SortId extends string = string
	"
>
	// Types/constants
	import type { Match } from '$/lib/string.ts'
	import { fuzzyMatch } from '$/lib/string.ts'
	import { untrack } from 'svelte'
	import { SvelteMap, SvelteSet } from 'svelte/reactivity'

	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	type GroupHeaderSnippetContext = {
		groupKey?: _GroupKey,
	}

	type ItemSnippetContext = {
		key?: _Key,
	} & (
		| {
				item?: _Item,
				isPlaceholder?: false,
				searchQuery?: string,
				matches?: SvelteSet<Match>,
			}
		| {
				item?: never,
				isPlaceholder?: true,
			}
	)


	// State
	let {
		items,

		filterGroups = [],
		defaultFilterIds = new Set<_FilterId>(),
		activeFilters = $bindable(new Set<Filter<_Item, _FilterId>>()),

		sortOptions,
		defaultSortId,

		getKey,
		getSearchText,
		getSortValue,
		getGroupKey,
		getGroupLabel,
		getGroupKeyForPlaceholder,

		placeholderKeys = new Set<_Key>(),
		visiblePlaceholderKeys = $bindable<_Key[]>([]),

		scrollPosition = 'Auto',
		pagination,

		searchQuery = $bindable(''),
		searchPlaceholder,
		searchInputRef = $bindable<HTMLInputElement | null>(null),
		matchesForItem = $bindable(new SvelteMap<_Item, SvelteSet<Match>>()),

		displayCount = $bindable(0),
		displayedItems = $bindable<_Item[]>([]),
		filter,

		GroupHeader,
		Item,
		Empty,
		ToolbarExtra,

		listViewTransition = true,
		...ulProps
	}: WithRest<
		{
			items: _Item[]

			filterGroups?: FilterGroup<_Item, _FilterId>[]
			defaultFilterIds?: Set<_FilterId>
			activeFilters?: Set<Filter<_Item, _FilterId>>

			sortOptions?: Sort<_Item, _SortId>[]
			defaultSortId?: _SortId

			getKey: (item: _Item) => _Key
			/** When `searchPlaceholder` is set, pass this so rows get fuzzy `matches` and are not all `hidden` by search. */
			getSearchText?: (item: _Item) => string
			getSortValue?: (item: _Item) => number | string
			getGroupKey?: (item: _Item) => _GroupKey
			getGroupLabel?: (groupKey: _GroupKey) => string
			getGroupKeyForPlaceholder?: (key: _Key) => _GroupKey

			placeholderKeys?: Set<_Key>
			visiblePlaceholderKeys?: _Key[]

			scrollPosition?: 'Start' | 'End' | 'Auto'
			pagination?: ListPagination

			searchQuery?: string
			searchPlaceholder?: string
			searchInputRef?: HTMLInputElement | null
			matchesForItem?: SvelteMap<_Item, SvelteSet<Match>>

			displayCount?: number
			displayedItems?: _Item[]
			filter?: (item: _Item) => boolean

			GroupHeader?: import('svelte').Snippet<[context?: GroupHeaderSnippetContext]>
			Item: import('svelte').Snippet<[context?: ItemSnippetContext]>
			Empty?: import('svelte').Snippet
			ToolbarExtra?: import('svelte').Snippet

			/** When true, the rendered list commits row changes inside colocated list view transitions. */
			listViewTransition?: boolean
		},
		SvelteHTMLElements['ul']
	> = $props()

	let filteredItems = $state<_Item[]>([])
	let sortedItems = $state<_Item[]>([])
	let hasAppliedDefaultFilters = $state(false)


	// (Derived)
	const hasFilterGroups = $derived(
		filterGroups.length > 0 && filterGroups.some((g) => g.filters.length > 1)
	)
	const hasSortOptions = $derived(
		(sortOptions?.length ?? 0) > 1
	)
	const itemsToSort = $derived(
		(
			filter ?
				(hasFilterGroups ? filteredItems : items).filter(filter)
			:
				(hasFilterGroups ? filteredItems : items)
		)
	)
	const displayItems = $derived(
		hasSortOptions ?
			sortedItems
		:
			itemsToSort
	)
	const orderMap = $derived(
		new Map(displayItems.map((item, i) => [getKey(item), i]))
	)
	$effect(() => {
		if (!hasFilterGroups) filteredItems = items
	})
	$effect(() => {
		if (!hasSortOptions) sortedItems = itemsToSort
	})
	$effect(() => {
		if (
			!hasAppliedDefaultFilters &&
			defaultFilterIds.size > 0 &&
			activeFilters.size === 0
		) {
			const matching = filterGroups.flatMap((g) => (
				g.filters.filter((f) => defaultFilterIds.has(f.id))
			))
			if (matching.length > 0) {
				activeFilters = new Set(matching)
				hasAppliedDefaultFilters = true
			}
		}
	})
	$effect(() => {
		if (defaultFilterIds.size > 0 && filterGroups.length > 0) {
			const matching = filterGroups.flatMap((g) => (
				g.filters.filter((f) => defaultFilterIds.has(f.id))
			))
			if (matching.length > 0) activeFilters = new Set(matching)
		}
	})
	$effect(() => {
		displayCount = displayItems.length
	})
	$effect(() => {
		displayedItems = displayItems
	})
	$effect(() => {
		if (getSearchText === undefined) return
		const fromSearch = getSearchText
		const q = searchQuery.trim()
		untrack(() => {
			if (q.length === 0) {
				matchesForItem.clear()
				return
			}
			for (const item of displayItems)
				matchesForItem.set(
					item,
					new SvelteSet(fuzzyMatch(fromSearch(item), q)),
				)
		})
	})


	// Components
	import Filters from '$/components/Filters.svelte'
	import Sorts from '$/components/Sorts.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	data-column
	data-sticky-container
	role="group"
	aria-label="Refinable list"
	onkeydown={(e) => {
		if (
			!searchInputRef ||
			e.ctrlKey ||
			e.metaKey ||
			e.altKey ||
			e.key.length !== 1 ||
			!/^[a-zA-Z]$/.test(e.key) ||
			(e.target instanceof Node && searchInputRef.contains(e.target))
		)
			return
		e.preventDefault()
		searchInputRef.focus()
		searchQuery = searchQuery + e.key
	}}
>
	{#if searchPlaceholder !== undefined || hasFilterGroups || hasSortOptions || ToolbarExtra}
		<div
			data-sticky
			data-row="gap-4 wrap"
			role="group"
			aria-label="Search, filters and sorts"
		>
			{#if searchPlaceholder !== undefined}
				<label
					data-row-item="flexible"
					data-column
				>
					<input
						type="search"
						bind:value={searchQuery}
						bind:this={searchInputRef}
						placeholder={searchPlaceholder}
						aria-label="Filter list"
					/>
				</label>
			{/if}

			{#if hasFilterGroups}
				<Filters
					items={items}
					{filterGroups}
					bind:activeFilters
					bind:filteredItems
					onreset={(e) => {
						e.preventDefault()
						activeFilters = new Set()
					}}
				/>
			{/if}

			{#if hasSortOptions}
				<Sorts
					items={itemsToSort}
					sortOptions={sortOptions!}
					{defaultSortId}
					bind:sortedItems
				/>
			{/if}

			{#if ToolbarExtra}
				{@render ToolbarExtra()}
			{/if}
		</div>
	{/if}

	<UnorderedList
		items={new SvelteSet(displayItems)}
		{getKey}
		getSortValue={
			getSortValue ?? ((item: _Item) => orderMap.get(getKey(item)) ?? Infinity)
		}
		{getGroupKey}
		{getGroupLabel}
		{getGroupKeyForPlaceholder}
		{placeholderKeys}
		bind:visiblePlaceholderKeys={
			() => visiblePlaceholderKeys,
			(_visiblePlaceholderKeys) => { visiblePlaceholderKeys = _visiblePlaceholderKeys }
		}
		{scrollPosition}
		{pagination}
		{listViewTransition}
		{searchQuery}
		{matchesForItem}
		{GroupHeader}
		{Item}
		{Empty}
		{...ulProps}
	/>
</div>
