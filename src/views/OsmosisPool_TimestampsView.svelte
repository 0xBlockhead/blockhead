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
		title = 'Spot prices',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.OsmosisPool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OsmosisPool_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				baseAssetDenom: true,
				quoteAssetDenom: true,
				spotPrice: true,
			},
		})
	}
>
	{#snippet Item({ item: osmosisPoolTimestamp })}
		{@const osmosisPoolTimestampSelector = osmosisPoolTimestamp[EntityMetaKey.Selector]}
		{@const pool = osmosisPoolTimestampSelector.$pool}
		<EntityView
			entityType={EntityType.OsmosisPool_Timestamp}
			entitySelector={osmosisPoolTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]/(osmosisPool)/observations/[blockHeight=nonNegativeBigInt]/[baseAssetDenom=stringSegment]/[quoteAssetDenom=stringSegment]',
					{
						network: (
							'caip2' in pool.$network ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						blockHeight: String(osmosisPoolTimestampSelector.blockHeight),
						baseAssetDenom: osmosisPoolTimestampSelector.baseAssetDenom,
						quoteAssetDenom: osmosisPoolTimestampSelector.quoteAssetDenom,
					}
				)
			}
		>
			{#snippet Title()}
				{[osmosisPoolTimestampSelector.baseAssetDenom, osmosisPoolTimestampSelector.quoteAssetDenom].filter(Boolean).join(' ') || 'Osmosis pool timestamp'}
			{/snippet}

			{#snippet Value()}
				{osmosisPoolTimestamp.spotPrice}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
