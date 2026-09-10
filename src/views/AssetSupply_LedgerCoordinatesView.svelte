<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
		{@const assetInstance = assetSupplyLedgerCoordinateSelector.$assetInstance}
		<EntityView
			entityType={EntityType.AssetSupply_LedgerCoordinate}
			entitySelector={assetSupplyLedgerCoordinateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/supply/[supplyScopeKey=stringSegment]/ledger/[ledgerCoordinateKind=stringSegment]/[ledgerCoordinateValue=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in assetInstance.$network ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
						supplyScopeKey: assetSupplyLedgerCoordinateSelector.supplyScopeKey,
						ledgerCoordinateKind: assetSupplyLedgerCoordinateSelector.ledgerCoordinateKind,
						ledgerCoordinateValue: String(assetSupplyLedgerCoordinateSelector.ledgerCoordinateValue),
						source: assetSupplyLedgerCoordinateSelector.source,
					}
				)
			}
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
