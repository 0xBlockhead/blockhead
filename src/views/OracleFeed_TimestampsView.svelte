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
	}: EntityListViewProps<EntityType.OracleFeed_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OracleFeed_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					description: true,
					latestRoundId: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: oracleFeedTimestamp })}
		{@const oracleFeedTimestampSelector = oracleFeedTimestamp[EntityMetaKey.Selector]}
		{@const oracleFeed = oracleFeedTimestampSelector.$oracleFeed}
		<EntityView
			entityType={EntityType.OracleFeed_Timestamp}
			entitySelector={oracleFeedTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/oracle/feed/[address=evmAddress]/(oracleFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in oracleFeed.$network ?
								caip2StringFromValue(oracleFeed.$network.caip2)
							:
								oracleFeed.$network.slug
						),
						address: oracleFeed.address,
						timestampMs: String(oracleFeedTimestampSelector.timestampMs),
						source: oracleFeedTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{oracleFeedTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(oracleFeedTimestamp.description ?? ''), String(oracleFeedTimestamp.latestRoundId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{oracleFeedTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
