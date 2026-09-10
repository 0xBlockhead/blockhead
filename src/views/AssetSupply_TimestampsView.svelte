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
	}: EntityListViewProps<EntityType.AssetSupply_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AssetSupply_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				supplyScopeKey: true,
				totalSupply: true,
				circulatingSupply: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: assetSupplyTimestamp })}
		{@const assetSupplyTimestampSelector = assetSupplyTimestamp[EntityMetaKey.Selector]}
		{@const assetInstance = assetSupplyTimestampSelector.$assetInstance}
		<EntityView
			entityType={EntityType.AssetSupply_Timestamp}
			entitySelector={assetSupplyTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/supply/[supplyScopeKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in assetInstance.$network ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
						supplyScopeKey: assetSupplyTimestampSelector.supplyScopeKey,
						timestampMs: String(assetSupplyTimestampSelector.timestampMs),
						source: assetSupplyTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{assetSupplyTimestampSelector.supplyScopeKey || 'asset supply timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(assetSupplyTimestamp.totalSupply != null ? String(assetSupplyTimestamp.totalSupply) + assetSupplyTimestampSelector.$assetInstance.symbol : ''), (assetSupplyTimestamp.circulatingSupply != null ? String(assetSupplyTimestamp.circulatingSupply) + assetSupplyTimestampSelector.$assetInstance.symbol : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{assetSupplyTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
