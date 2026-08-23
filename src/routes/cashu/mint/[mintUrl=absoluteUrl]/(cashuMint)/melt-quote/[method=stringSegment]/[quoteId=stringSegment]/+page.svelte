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
	import BlockheadCashuMeltQuoteView from '$/views/BlockheadCashuMeltQuoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuMeltQuote, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.quoteId || 'blockhead Cashu melt quote')} • blockhead Cashu melt quote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu melt quote'} • blockhead Cashu melt quote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuMeltQuote, data.selector)}

	<BlockheadCashuMeltQuoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
