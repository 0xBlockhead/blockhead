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

	const pageSelection = $derived(select(EntityType.BlockheadCashuMintQuote, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuMintQuoteView from '$/views/BlockheadCashuMintQuoteView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.quoteId || 'blockhead Cashu mint quote')} • blockhead Cashu mint quote • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuMintQuoteView
		selection={pageSelection}
	/>
</Page>
