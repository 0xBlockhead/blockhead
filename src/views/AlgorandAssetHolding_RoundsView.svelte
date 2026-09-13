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
	}: EntityListViewProps<EntityType.AlgorandAssetHolding_Round> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandAssetHolding_Round}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandAssetHoldingRound })}
		{@const algorandAssetHoldingRoundSelector = algorandAssetHoldingRound[EntityMetaKey.Selector]}
		{@const account = algorandAssetHoldingRoundSelector.$account}
		{@const asset = algorandAssetHoldingRoundSelector.$asset}
		<EntityView
			entityType={EntityType.AlgorandAssetHolding_Round}
			entitySelector={algorandAssetHoldingRoundSelector}
			href={
				asset.$network.$network.caip2 !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/account/[address=stringSegment]/(algorandAccount)/asset/[assetNetwork=networkCaip2]/[assetId=nonNegativeBigInt]/round/[round=nonNegativeBigInt]/[source=stringSegment]',
						{
							network: (
								account.$network.$network.caip2 !== undefined ?
									caip2StringFromValue(account.$network.$network.caip2)
								:
									account.$network.$network.slug
							),
							address: account.address,
							assetNetwork: String(asset.$network.$network.caip2),
							assetId: String(asset.assetId),
							round: String(algorandAssetHoldingRoundSelector.round),
							source: algorandAssetHoldingRoundSelector.source,
						}
					)
				:
					undefined
			}
		/>
	{/snippet}
</EntitiesList>
