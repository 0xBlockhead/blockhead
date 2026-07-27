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
	}: EntityListViewProps<EntityType.HyperliquidOrder> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidOrder}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidOrder })}
		<EntityView
			entityType={EntityType.HyperliquidOrder}
			entitySelector={hyperliquidOrder[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid order
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
