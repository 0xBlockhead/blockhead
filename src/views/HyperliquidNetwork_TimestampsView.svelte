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
	}: EntityListViewProps<EntityType.HyperliquidNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					perpMarketCount: true,
					totalStake: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: hyperliquidNetworkTimestamp })}
		{@const hyperliquidNetworkTimestampSelector = hyperliquidNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = hyperliquidNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidNetwork_Timestamp}
			entitySelector={hyperliquidNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(hyperliquidNetworkTimestampSelector.timestampMs),
						source: hyperliquidNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{hyperliquidNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(hyperliquidNetworkTimestamp.perpMarketCount ?? ''), String(hyperliquidNetworkTimestamp.totalStake ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
