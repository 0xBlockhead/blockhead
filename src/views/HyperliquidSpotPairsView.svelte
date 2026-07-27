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
	}: EntityListViewProps<EntityType.HyperliquidSpotPair> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidSpotPair}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidSpotPair })}
		<EntityView
			entityType={EntityType.HyperliquidSpotPair}
			entitySelector={hyperliquidSpotPair[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid spot pair
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
