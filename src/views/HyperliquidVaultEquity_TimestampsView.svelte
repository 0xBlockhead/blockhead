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
	}: EntityListViewProps<EntityType.HyperliquidVaultEquity_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidVaultEquity_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidVaultEquityTimestamp })}
		<EntityView
			entityType={EntityType.HyperliquidVaultEquity_Timestamp}
			entitySelector={hyperliquidVaultEquityTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid vault equity timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
