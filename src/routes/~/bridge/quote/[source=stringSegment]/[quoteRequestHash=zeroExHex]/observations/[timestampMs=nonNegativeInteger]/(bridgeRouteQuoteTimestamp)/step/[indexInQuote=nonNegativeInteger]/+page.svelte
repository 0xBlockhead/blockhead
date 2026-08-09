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

	const pageSelection = $derived(select(EntityType.BridgeRouteQuoteStep, {
		$quote: data.selector,
		indexInQuote: Number(params.indexInQuote),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteQuoteStepView from '$/views/BridgeRouteQuoteStepView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInQuote ?? '') ? 'Step #' + String(pageSelection.entitySelector.indexInQuote ?? '') : '') || 'bridge route quote step')} • bridge route quote step • Blockhead</title>
</svelte:head>


<Page>
	<BridgeRouteQuoteStepView
		selection={pageSelection}
	/>
</Page>
