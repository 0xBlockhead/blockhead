<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import type { Sort } from '$/components/RefinableList.svelte'
	import RefinableList from '$/components/RefinableList.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	type Row = { id: string, label: string }

	const items: Row[] = [
		{ id: 'a', label: 'Alpha' },
		{ id: 'b', label: 'Bravo' },
		{ id: 'c', label: 'Candle' },
	]

	const sortOptions: Sort<Row, 'asc' | 'desc'>[] = [
		{
			id: 'asc',
			label: 'A-Z',
			compare: (x, y) => x.label.localeCompare(y.label),
		},
		{
			id: 'desc',
			label: 'Z-A',
			compare: (x, y) => y.label.localeCompare(x.label),
		},
	]


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>List view transitions • Blockhead</title>
</svelte:head>


<Page>
	<main
		data-testid='list-vt-demo'
		data-column
	>
		<h1>List view transitions (demo)</h1>

		<RefinableList
			{items}
			getKey={(row) => row.id}
			getSearchText={(row) => row.label}
			{sortOptions}
			defaultSortId='asc'
			searchPlaceholder='Filter'
		>
			{#snippet ItemPlaceholder()}
				<span>...</span>
			{/snippet}

			{#snippet Item({ item })}
				<span data-testid='row-label'>{item.label}</span>
			{/snippet}
		</RefinableList>
	</main>
</Page>
