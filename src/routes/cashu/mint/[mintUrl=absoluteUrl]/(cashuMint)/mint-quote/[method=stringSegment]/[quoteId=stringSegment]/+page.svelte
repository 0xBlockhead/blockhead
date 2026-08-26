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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCashuMintQuote, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuMintQuoteView from '$/views/BlockheadCashuMintQuoteView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.quoteId || 'blockhead Cashu mint quote')} • blockhead Cashu mint quote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu mint quote'} • blockhead Cashu mint quote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadCashuMintQuoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
