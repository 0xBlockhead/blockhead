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
	}: EntityListViewProps<EntityType.StellarNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarNetworkTimestamp })}
		<EntityView
			entityType={EntityType.StellarNetwork_Timestamp}
			entitySelector={stellarNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
