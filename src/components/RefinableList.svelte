<script module lang="ts">
	export type Sort<_Item, _SortId extends string = string> = {
		id: _SortId
		label: string
		compare: (itemA: _Item, itemB: _Item) => number
	}
</script>


<script
	lang="ts"
	generics="
		_Item,
		_Key extends string | number = string | number,
		_SortId extends string = string
	"
>
	// Types/constants
	import type { Match } from '$/lib/string.ts'
	import type { Snippet } from 'svelte'
	import { SvelteMap, SvelteSet } from 'svelte/reactivity'

	import { fuzzyMatch } from '$/lib/string.ts'

	type ItemSnippetContext = {
		key: _Key
		item: _Item
		searchQuery?: string
		matches?: SvelteSet<Match>
	}


	// State
	let {
		items,
		getKey,
		getSearchText,
		sortOptions,
		defaultSortId,
		searchPlaceholder,
		Item,
		listViewTransition = true,
	}: {
		items: _Item[]
		getKey: (item: _Item) => _Key
		getSearchText: (item: _Item) => string
		sortOptions: Sort<_Item, _SortId>[]
		defaultSortId: _SortId
		searchPlaceholder: string
		Item: Snippet<[context: ItemSnippetContext]>
		listViewTransition?: boolean
	} = $props()

	let searchQuery = $state('')
	let activeSortId = $state<_SortId>()

	const sortById = $derived(
		new Map(sortOptions.map((sort) => [sort.id, sort]))
	)
	const effectiveSortId = $derived(
		activeSortId ?? defaultSortId
	)
	const sortedItems = $derived.by(() => {
		const compare = sortById.get(effectiveSortId)?.compare
		return compare == null ? items : [...items].sort(compare)
	})
	const sortIndexByKey = $derived(
		new Map(sortedItems.map((item, index) => [getKey(item), index]))
	)
	const matchesForItem = $derived.by(() => {
		const query = searchQuery.trim()
		if (query === '')
			return new SvelteMap<_Item, SvelteSet<Match>>()

		return new SvelteMap(items.map((item) => [
			item,
			new SvelteSet(fuzzyMatch(getSearchText(item), query)),
		]))
	})


	// Components
	import Sorts from '$/components/Sorts.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<div
	data-column
	data-sticky-container
	role="group"
	aria-label="Refinable list"
>
	<div
		data-sticky
		data-row="gap-4 wrap"
		role="group"
		aria-label="Search and sort"
	>
		<label
			data-row-item="flexible"
			data-column
		>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder={searchPlaceholder}
				aria-label="Filter list"
			/>
		</label>

		<Sorts
			{sortOptions}
			value={effectiveSortId}
			onchange={(sortId) => {
				activeSortId = sortId
			}}
		/>
	</div>

	<UnorderedList
		items={new SvelteSet(sortedItems)}
		{getKey}
		getSortValue={(item) => sortIndexByKey.get(getKey(item)) ?? Infinity}
		{listViewTransition}
		{searchQuery}
		{matchesForItem}
		{Item}
	/>
</div>
