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
		title = 'Quote steps',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BridgeRouteQuoteStep> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeRouteQuoteStep}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInQuote: true,
				tool: true,
				stepType: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeRouteQuoteStep })}
		{@const bridgeRouteQuoteStepSelector = bridgeRouteQuoteStep[EntityMetaKey.Selector]}
		{@const quote = bridgeRouteQuoteStepSelector.$quote}
		<EntityView
			entityType={EntityType.BridgeRouteQuoteStep}
			entitySelector={bridgeRouteQuoteStepSelector}
			href={
				resolve(
					'/~/bridge/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/(bridgeRouteQuoteTimestamp)/step/[indexInQuote=nonNegativeInteger]',
					{
						source: quote.source,
						quoteRequestHash: quote.quoteRequestHash,
						timestampMs: String(quote.timestampMs),
						indexInQuote: String(bridgeRouteQuoteStepSelector.indexInQuote),
					}
				)
			}
		>
			{#snippet Title()}
				{`Step #${bridgeRouteQuoteStepSelector.indexInQuote}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(bridgeRouteQuoteStep.tool ?? ''), (bridgeRouteQuoteStep.stepType ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
