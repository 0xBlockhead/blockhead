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
	import SwapQuoteStepView from '$/views/SwapQuoteStepView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SwapQuoteStep, {
					$quote: data.selector,
					indexInQuote: Number(params.indexInQuote),
				}))}
			<title>{data?.title ?? 'swap quote step'} • swap quote step • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'swap quote step'} • swap quote step • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SwapQuoteStep, {
					$quote: data.selector,
					indexInQuote: Number(params.indexInQuote),
				}))}

		<SwapQuoteStepView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
