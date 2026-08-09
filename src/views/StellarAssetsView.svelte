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
	}: EntityListViewProps<EntityType.StellarAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAsset}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAsset })}
		{@const stellarAssetSelector = stellarAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarAsset}
			entitySelector={stellarAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/asset/[assetKey=stringSegment]',
					{
						network: (
							'caip2' in stellarAssetSelector.$network.$network ?
								caip2StringFromValue(stellarAssetSelector.$network.$network.caip2)
							:
								stellarAssetSelector.$network.$network.slug
						),
						assetKey: stellarAssetSelector.assetKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
