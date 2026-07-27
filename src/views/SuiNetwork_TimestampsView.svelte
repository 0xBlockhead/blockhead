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
	}: EntityListViewProps<EntityType.SuiNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiNetworkTimestamp })}
		<EntityView
			entityType={EntityType.SuiNetwork_Timestamp}
			entitySelector={suiNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
