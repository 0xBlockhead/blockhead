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
	}: EntityListViewProps<EntityType.BnbBeaconToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconToken}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				tokenName: true,
				tokenType: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconToken })}
		{@const bnbBeaconTokenSelector = bnbBeaconToken[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconToken}
			entitySelector={bnbBeaconTokenSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]',
					{
						network: (
							'caip2' in bnbBeaconTokenSelector.$network.$network ?
								caip2StringFromValue(bnbBeaconTokenSelector.$network.$network.caip2)
							:
								bnbBeaconTokenSelector.$network.$network.slug
						),
						symbol: bnbBeaconTokenSelector.symbol,
					}
				)
			}
		>
			{#snippet Title()}
				{bnbBeaconTokenSelector.symbol || 'bnb beacon token'}
			{/snippet}

			{#snippet Value()}
				{[(bnbBeaconToken.tokenName ?? ''), (bnbBeaconToken.tokenType ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
