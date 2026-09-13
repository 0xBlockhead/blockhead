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
	}: EntityListViewProps<EntityType.CardanoNativeAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoNativeAsset}
	bind:open
	resource={
		selection({
			fields: {
				assetName: true,
				fingerprint: true,
				policyId: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoNativeAsset })}
		{@const cardanoNativeAssetSelector = cardanoNativeAsset[EntityMetaKey.Selector]}
		{@const network = cardanoNativeAssetSelector.$network}
		<EntityView
			entityType={EntityType.CardanoNativeAsset}
			entitySelector={cardanoNativeAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-asset/[policyId=stringSegment]/[assetName=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						policyId: cardanoNativeAssetSelector.policyId,
						assetName: cardanoNativeAssetSelector.assetName,
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoNativeAssetSelector.assetName || cardanoNativeAssetSelector.policyId || 'Cardano native asset'}
			{/snippet}

			{#snippet Value()}
				{cardanoNativeAsset.fingerprint ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
