<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteQuoteStepView from '$/views/BridgeRouteQuoteStepView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BridgeRouteQuoteStep, {
					$quote: data.selector,
					indexInQuote: Number(params.indexInQuote),
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInQuote ?? '') ? 'Step #' + String(pageSelection.entitySelector.indexInQuote ?? '') : '') || 'bridge route quote step')} • bridge route quote step • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bridge route quote step'} • bridge route quote step • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BridgeRouteQuoteStep, {
					$quote: data.selector,
					indexInQuote: Number(params.indexInQuote),
				}))}

		<BridgeRouteQuoteStepView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
