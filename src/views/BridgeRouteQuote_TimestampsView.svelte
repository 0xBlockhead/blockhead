<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BridgeRouteQuote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeRouteQuote_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					fromChainId: true,
					toChainId: true,
					timestampMs: true,
					source: true,
					estimatedCostUsd: true,
					estimatedDurationSeconds: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bridgeRouteQuoteTimestamp })}
		{@const bridgeRouteQuoteTimestampSelector = bridgeRouteQuoteTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BridgeRouteQuote_Timestamp}
			entitySelector={bridgeRouteQuoteTimestampSelector}
			href={
				resolve(
					'/~/bridge/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]',
					{
						source: bridgeRouteQuoteTimestampSelector.source,
						quoteRequestHash: bridgeRouteQuoteTimestampSelector.quoteRequestHash,
						timestampMs: String(bridgeRouteQuoteTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{[String(bridgeRouteQuoteTimestamp.fromChainId), 'to', String(bridgeRouteQuoteTimestamp.toChainId)].filter(Boolean).join(' ') || 'bridge route quote timestamp'}
			{/snippet}

			{#snippet Value()}
				{bridgeRouteQuoteTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[bridgeRouteQuoteTimestampSelector.source, String(bridgeRouteQuoteTimestamp.estimatedCostUsd ?? ''), String(bridgeRouteQuoteTimestamp.estimatedDurationSeconds ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
