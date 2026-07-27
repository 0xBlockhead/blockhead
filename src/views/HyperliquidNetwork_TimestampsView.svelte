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
	}: EntityListViewProps<EntityType.HyperliquidNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidNetworkTimestamp })}
		<EntityView
			entityType={EntityType.HyperliquidNetwork_Timestamp}
			entitySelector={hyperliquidNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
