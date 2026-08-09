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
	}: EntityListViewProps<EntityType.CompoundCometAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundCometAsset}
	bind:open
	resource={
		selection({
			...{
				fields: {
					symbol: true,
					borrowCF: true,
					liquidateCF: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: compoundCometAsset })}
		{@const compoundCometAssetSelector = compoundCometAsset[EntityMetaKey.Selector]}
		{@const comet = compoundCometAssetSelector.$comet}
		<EntityView
			entityType={EntityType.CompoundCometAsset}
			entitySelector={compoundCometAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/asset/[symbol=stringSegment]',
					{
						network: (
							'caip2' in comet.$network ?
								caip2StringFromValue(comet.$network.caip2)
							:
								comet.$network.slug
						),
						cometAddress: comet.cometAddress,
						symbol: compoundCometAssetSelector.symbol,
					}
				)
			}
		>
			{#snippet Title()}
				{compoundCometAssetSelector.symbol || 'Compound Comet collateral asset'}
			{/snippet}

			{#snippet Value()}
				{[String(compoundCometAsset.borrowCF), String(compoundCometAsset.liquidateCF)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
