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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BridgeRouteQuoteStep, {
		$quote: data.selector,
		indexInQuote: Number(params.indexInQuote),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteQuoteStepView from '$/views/BridgeRouteQuoteStepView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInQuote ?? '') ? 'Step #' + String(pageSelection.entitySelector.indexInQuote ?? '') : '') || 'bridge route quote step')} • bridge route quote step • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bridge route quote step'} • bridge route quote step • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BridgeRouteQuoteStepView
		selection={pageSelection}
	/>
	{/if}
</Page>
