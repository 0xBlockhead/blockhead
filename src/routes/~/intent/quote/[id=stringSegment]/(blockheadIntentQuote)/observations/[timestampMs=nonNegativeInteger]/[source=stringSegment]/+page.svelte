<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadIntentQuote_Timestamp, {
		$quote: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			quoteId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadIntentQuote_TimestampView from '$/views/BlockheadIntentQuote_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.source ?? '') || 'blockhead intent quote timestamp' : (pageSelection.entity.quoteId ?? '') || pageSelection.entitySelector.source || 'blockhead intent quote timestamp')} • blockhead intent quote timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead intent quote timestamp'} • blockhead intent quote timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadIntentQuote_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
