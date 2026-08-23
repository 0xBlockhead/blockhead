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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCashuMeltQuote, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuMeltQuoteView from '$/views/BlockheadCashuMeltQuoteView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.quoteId || 'blockhead Cashu melt quote')} • blockhead Cashu melt quote • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu melt quote'} • blockhead Cashu melt quote • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadCashuMeltQuoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
