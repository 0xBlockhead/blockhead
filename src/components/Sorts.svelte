<script
	lang="ts"
	generics="
		_Item,
		_SortId extends string = string
	"
>
	// Types/constants
	import type { Sort } from '$/components/RefinableList.svelte'


	// State
	let {
		sortOptions,
		value,
		onchange,
	}: {
		sortOptions: Sort<_Item, _SortId>[]
		value: _SortId
		onchange: (sortId: _SortId) => void
	} = $props()

	const sortById = $derived(
		new Map(sortOptions.map((sort) => [sort.id, sort]))
	)


	// Components
	import Select from '$/components/Select.svelte'
</script>


<div
	class="sorts"
	data-card="padding-5 radius-4"
	data-row="gap-6 wrap"
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
				() => sortById.get(value),
				(sort) => {
					if (sort != null)
						onchange(sort.id)
				}
			}
			getItemId={(sort) => sort.id}
			getItemLabel={(sort) => sort.label}
			ariaLabel="Sort by"
		/>
	</fieldset>
</div>


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
