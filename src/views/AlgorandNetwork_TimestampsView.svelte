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
	}: EntityListViewProps<EntityType.AlgorandNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandNetworkTimestamp })}
		<EntityView
			entityType={EntityType.AlgorandNetwork_Timestamp}
			entitySelector={algorandNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				algorand network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
