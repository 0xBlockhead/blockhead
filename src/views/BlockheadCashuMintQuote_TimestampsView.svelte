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
	}: EntityListViewProps<EntityType.BlockheadCashuMintQuote_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuMintQuote_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				state: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuMintQuoteTimestamp })}
		{@const blockheadCashuMintQuoteTimestampSelector = blockheadCashuMintQuoteTimestamp[EntityMetaKey.Selector]}
		{@const mintQuote = blockheadCashuMintQuoteTimestampSelector.$mintQuote}
		<EntityView
			entityType={EntityType.BlockheadCashuMintQuote_Timestamp}
			entitySelector={blockheadCashuMintQuoteTimestampSelector}
			href={
				resolve(
					'/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/mint-quote/[method=stringSegment]/[quoteId=stringSegment]/(blockheadCashuMintQuote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						mintUrl: encodeURIComponent(mintQuote.$mint.mintUrl),
						method: mintQuote.method,
						quoteId: mintQuote.quoteId,
						timestampMs: String(blockheadCashuMintQuoteTimestampSelector.timestampMs),
						source: blockheadCashuMintQuoteTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadCashuMintQuoteTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuMintQuoteTimestamp.state}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCashuMintQuoteTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
