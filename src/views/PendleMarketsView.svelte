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
	}: EntityListViewProps<EntityType.PendleMarket> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PendleMarket}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					impliedApy: true,
					underlyingApy: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: pendleMarket })}
		{@const pendleMarketSelector = pendleMarket[EntityMetaKey.Selector]}
		{@const network = pendleMarketSelector.$network}
		<EntityView
			entityType={EntityType.PendleMarket}
			entitySelector={pendleMarketSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pendle/market/[marketAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						marketAddress: pendleMarketSelector.marketAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{pendleMarket.name || 'Pendle market'}
			{/snippet}

			{#snippet Value()}
				{[String(pendleMarket.impliedApy), String(pendleMarket.underlyingApy)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{pendleMarket.$network.name || (pendleMarket.$network.caip2 == null ? '' : `${pendleMarket.$network.caip2.namespace}:${pendleMarket.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
