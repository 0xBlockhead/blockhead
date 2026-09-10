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
	}: EntityListViewProps<EntityType.FilecoinDeal_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinDeal_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				verifiedDeal: true,
				height: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinDealTimestamp })}
		{@const filecoinDealTimestampSelector = filecoinDealTimestamp[EntityMetaKey.Selector]}
		{@const deal = filecoinDealTimestampSelector.$deal}
		<EntityView
			entityType={EntityType.FilecoinDeal_Timestamp}
			entitySelector={filecoinDealTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/deal/[dealId=nonNegativeBigInt]/(filecoinDeal)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in deal.$network ?
								caip2StringFromValue(deal.$network.caip2)
							:
								deal.$network.slug
						),
						dealId: String(deal.dealId),
						timestampMs: String(filecoinDealTimestampSelector.timestampMs),
						source: filecoinDealTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{filecoinDealTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{filecoinDealTimestamp.verifiedDeal ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinDealTimestamp.height ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
