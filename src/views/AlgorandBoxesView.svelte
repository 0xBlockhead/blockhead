<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'AlgorandBoxes-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandBox> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandBox}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandBox })}
		<EntityView
			entityType={EntityType.AlgorandBox}
			entitySelector={algorandBox[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand box
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
