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
	}: EntityListViewProps<EntityType.SwapQuote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwapQuote_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: swapQuoteTimestamp })}
		{@const swapQuoteTimestampSelector = swapQuoteTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SwapQuote_Timestamp}
			entitySelector={swapQuoteTimestampSelector}
			href={
				resolve(
					'/swap/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]',
					{
						source: swapQuoteTimestampSelector.source,
						quoteRequestHash: swapQuoteTimestampSelector.quoteRequestHash,
						timestampMs: String(swapQuoteTimestampSelector.timestampMs),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
