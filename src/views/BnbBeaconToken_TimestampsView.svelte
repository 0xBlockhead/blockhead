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
	}: EntityListViewProps<EntityType.BnbBeaconToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconToken_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					totalSupply: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTokenTimestamp })}
		{@const bnbBeaconTokenTimestampSelector = bnbBeaconTokenTimestamp[EntityMetaKey.Selector]}
		{@const token = bnbBeaconTokenTimestampSelector.$token}
		<EntityView
			entityType={EntityType.BnbBeaconToken_Timestamp}
			entitySelector={bnbBeaconTokenTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in token.$network.$network ?
								caip2StringFromValue(token.$network.$network.caip2)
							:
								token.$network.$network.slug
						),
						symbol: token.symbol,
						timestampMs: String(bnbBeaconTokenTimestampSelector.timestampMs),
						source: bnbBeaconTokenTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{bnbBeaconTokenTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconTokenTimestamp.totalSupply ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTokenTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
