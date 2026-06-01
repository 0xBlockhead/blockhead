<script
	lang="ts"
	generics="_Item, _SortId extends string = string"
>
	// Types/constants
	import type { Sort } from '$/components/RefinableList.svelte'


	// State
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let {
		items,
		sortOptions,
		activeSortId = $bindable<_SortId | ''>(''),
		sortedItems = $bindable(items),
		defaultSortId,
		setSortById = $bindable(),
		...divProps
	}: WithRest<
		{
			items: _Item[]
			sortOptions: Sort<_Item, _SortId>[]
			activeSortId?: _SortId | ''
			sortedItems?: _Item[]
			defaultSortId?: _SortId
			setSortById?: (sortId: _SortId | '') => void
		},
		SvelteHTMLElements['div']
	> = $props()



	const effectiveSortId = $derived(
		(activeSortId === '' ? (defaultSortId ?? sortOptions[0]?.id) : activeSortId) ?? ''
	)
	const sortById = $derived(
		new Map(sortOptions.map((s) => [s.id, s]))
	)


	// Functions

	const sortItems = (sortId: _SortId | '') => {
		const sort = sortId && sortById.get(sortId)
		return sort ? [...items].sort(sort.compare)
		:
			items
	}

	const _setSortById = (sortId: _SortId | '') => {
		activeSortId = sortId
	}
	setSortById = _setSortById


	// Actions

	$effect(() => {
		sortedItems = sortItems(effectiveSortId)
	})


	// Components
	import Select from '$/components/Select.svelte'
</script>


{#if sortOptions.length > 1}
	<div
		class="sorts"
		data-card="padding-5 radius-4"
		data-row="gap-6 wrap"
		{...divProps}
	>
		<fieldset
			data-sort-group
			data-column="gap-1"
		>
			<legend>
				Sort
			</legend>

			<Select
				items={sortOptions}
				bind:value={
					() => sortById.get(effectiveSortId) ?? undefined,
					(sort: Sort<_Item, _SortId> | undefined) => {
						activeSortId = (sort?.id ?? '') as _SortId | ''
					}
				}
				getItemId={(s) => s.id}
				getItemLabel={(s) => s.label}
				ariaLabel="Sort by"
			/>
		</fieldset>
	</div>
{/if}


<style>
	.sorts {
		align-items: start;

		> [data-sort-group] {
			gap: 0.33em;
			border: none;

			> legend {
				display: contents;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				font-size: 0.75em;
				color: var(--text-secondary);
			}
		}
	}
</style>
