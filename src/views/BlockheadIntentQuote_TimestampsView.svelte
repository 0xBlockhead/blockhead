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
	}: EntityListViewProps<EntityType.BlockheadIntentQuote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentQuote_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					quoteId: true,
					timestampMs: true,
					source: true,
					solverId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadIntentQuoteTimestamp })}
		{@const blockheadIntentQuoteTimestampSelector = blockheadIntentQuoteTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadIntentQuote_Timestamp}
			entitySelector={blockheadIntentQuoteTimestampSelector}
			href={
				resolve(
					'/~/intent/quote/[id=stringSegment]/(blockheadIntentQuote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						id: blockheadIntentQuoteTimestampSelector.$quote.id,
						timestampMs: String(blockheadIntentQuoteTimestampSelector.timestampMs),
						source: blockheadIntentQuoteTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadIntentQuoteTimestamp.quoteId ?? '') || blockheadIntentQuoteTimestampSelector.source || 'blockhead intent quote timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadIntentQuoteTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadIntentQuoteTimestamp.solverId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
