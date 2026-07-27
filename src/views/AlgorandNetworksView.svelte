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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AlgorandNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandNetwork}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandNetwork })}
		<EntityView
			entityType={EntityType.AlgorandNetwork}
			entitySelector={algorandNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand network
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
