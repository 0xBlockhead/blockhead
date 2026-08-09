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
	}: EntityListViewProps<EntityType.CompoundPositionCollateral> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CompoundPositionCollateral}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$asset: {
						fields: {
							borrowCF: true,
							liquidateCF: true,
						},
					},
					balance: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: compoundPositionCollateral })}
		{@const compoundPositionCollateralSelector = compoundPositionCollateral[EntityMetaKey.Selector]}
		{@const position = compoundPositionCollateralSelector.$position}
		<EntityView
			entityType={EntityType.CompoundPositionCollateral}
			entitySelector={compoundPositionCollateralSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/compound-comet/[cometAddress=evmAddress]/(compoundComet)/position/[accountAddress=evmAddress]/(compoundPosition)/collateral/[symbol=stringSegment]',
					{
						network: (
							'caip2' in position.$comet.$network ?
								caip2StringFromValue(position.$comet.$network.caip2)
							:
								position.$comet.$network.slug
						),
						cometAddress: position.$comet.cometAddress,
						accountAddress: position.$account.$actor.address,
						symbol: compoundPositionCollateralSelector.$asset.symbol,
					}
				)
			}
		>
			{#snippet Title()}
				{compoundPositionCollateralSelector.$asset.symbol || 'Compound Comet collateral asset'}
			{/snippet}

			{#snippet Value()}
				{compoundPositionCollateral.balance}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
