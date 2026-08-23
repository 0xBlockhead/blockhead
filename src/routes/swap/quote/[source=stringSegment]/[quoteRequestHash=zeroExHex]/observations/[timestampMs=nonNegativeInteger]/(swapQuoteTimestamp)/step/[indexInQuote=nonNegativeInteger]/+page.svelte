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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SwapQuoteStep, {
		$quote: data.selector,
		indexInQuote: Number(params.indexInQuote),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SwapQuoteStepView from '$/views/SwapQuoteStepView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'swap quote step'} • swap quote step • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'swap quote step'} • swap quote step • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SwapQuoteStepView
		selection={pageSelection}
	/>
	{/if}
</Page>
