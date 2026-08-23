<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentQuote_TimestampView from '$/views/BlockheadIntentQuote_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadIntentQuote_Timestamp, {
				$quote: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					quoteId: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.source ?? '') || 'blockhead intent quote timestamp' : (pageSelection.entity.quoteId ?? '') || pageSelection.entitySelector.source || 'blockhead intent quote timestamp')} • blockhead intent quote timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead intent quote timestamp'} • blockhead intent quote timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadIntentQuote_Timestamp, {
				$quote: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					quoteId: true,
				},
			})}

	<BlockheadIntentQuote_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
