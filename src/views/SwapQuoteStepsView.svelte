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
	}: EntityListViewProps<EntityType.SwapQuoteStep> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwapQuoteStep}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: swapQuoteStep })}
		{@const swapQuoteStepSelector = swapQuoteStep[EntityMetaKey.Selector]}
		{@const quote = swapQuoteStepSelector.$quote}
		<EntityView
			entityType={EntityType.SwapQuoteStep}
			entitySelector={swapQuoteStepSelector}
			href={
				resolve(
					'/swap/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/(swapQuoteTimestamp)/step/[indexInQuote=nonNegativeInteger]',
					{
						source: quote.source,
						quoteRequestHash: quote.quoteRequestHash,
						timestampMs: String(quote.timestampMs),
						indexInQuote: String(swapQuoteStepSelector.indexInQuote),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
