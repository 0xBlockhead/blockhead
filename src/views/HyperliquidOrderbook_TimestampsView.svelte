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
	}: EntityListViewProps<EntityType.HyperliquidOrderbook_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidOrderbook_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidOrderbookTimestamp })}
		<EntityView
			entityType={EntityType.HyperliquidOrderbook_Timestamp}
			entitySelector={hyperliquidOrderbookTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid orderbook timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
