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
	import BlockheadCashuMintQuote_TimestampView from '$/views/BlockheadCashuMintQuote_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuMintQuote_Timestamp, {
				$mintQuote: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead Cashu mint quote timestamp')} • blockhead Cashu mint quote timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu mint quote timestamp'} • blockhead Cashu mint quote timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuMintQuote_Timestamp, {
				$mintQuote: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadCashuMintQuote_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
