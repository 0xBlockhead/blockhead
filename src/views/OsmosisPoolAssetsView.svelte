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
		title = 'Pool assets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.OsmosisPoolAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OsmosisPoolAsset}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				denom: true,
				amount: true,
				weight: true,
			},
		})
	}
>
	{#snippet Item({ item: osmosisPoolAsset })}
		{@const osmosisPoolAssetSelector = osmosisPoolAsset[EntityMetaKey.Selector]}
		{@const pool = osmosisPoolAssetSelector.$pool}
		<EntityView
			entityType={EntityType.OsmosisPoolAsset}
			entitySelector={osmosisPoolAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]/(osmosisPool)/asset/[denom=stringSegment]',
					{
						network: (
							'caip2' in pool.$network ?
								caip2StringFromValue(pool.$network.caip2)
							:
								pool.$network.slug
						),
						poolId: pool.poolId,
						denom: osmosisPoolAssetSelector.denom,
					}
				)
			}
		>
			{#snippet Title()}
				{osmosisPoolAssetSelector.denom || 'Osmosis pool asset'}
			{/snippet}

			{#snippet Value()}
				{[osmosisPoolAsset.amount, (osmosisPoolAsset.weight ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
