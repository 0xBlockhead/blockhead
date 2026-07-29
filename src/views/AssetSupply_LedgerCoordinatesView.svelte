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
	}: EntityListViewProps<EntityType.AssetSupply_LedgerCoordinate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetSupply_LedgerCoordinate}
	bind:open
	resource={
		selection({
			fields: {
				supplyScopeKey: true,
				totalSupply: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: assetSupplyLedgerCoordinate })}
		{@const assetSupplyLedgerCoordinateSelector = assetSupplyLedgerCoordinate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AssetSupply_LedgerCoordinate}
			entitySelector={assetSupplyLedgerCoordinateSelector}
		>
			{#snippet Title()}
				{assetSupplyLedgerCoordinateSelector.supplyScopeKey || 'asset supply ledger coordinate'}
			{/snippet}

			{#snippet Value()}
				{assetSupplyLedgerCoordinate.totalSupply != null ? assetSupplyLedgerCoordinate.totalSupply + assetSupplyLedgerCoordinateSelector.$assetInstance.symbol : ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{assetSupplyLedgerCoordinateSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
