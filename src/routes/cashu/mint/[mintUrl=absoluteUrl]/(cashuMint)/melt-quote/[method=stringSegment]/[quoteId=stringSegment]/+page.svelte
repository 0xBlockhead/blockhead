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

	const pageSelection = $derived(select(EntityType.BlockheadCashuMeltQuote, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuMeltQuoteView from '$/views/BlockheadCashuMeltQuoteView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.quoteId || 'blockhead Cashu melt quote')} • blockhead Cashu melt quote • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuMeltQuoteView
		selection={pageSelection}
	/>
</Page>
