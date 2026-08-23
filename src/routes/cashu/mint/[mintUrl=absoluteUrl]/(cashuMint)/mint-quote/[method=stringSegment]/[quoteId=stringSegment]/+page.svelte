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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuMintQuoteView from '$/views/BlockheadCashuMintQuoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuMintQuote, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.quoteId || 'blockhead Cashu mint quote')} • blockhead Cashu mint quote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu mint quote'} • blockhead Cashu mint quote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuMintQuote, data.selector)}

	<BlockheadCashuMintQuoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
