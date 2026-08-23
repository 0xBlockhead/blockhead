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
	import SwapQuote_TimestampView from '$/views/SwapQuote_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SwapQuote_Timestamp, data.selector, {
				sources: [data.selector.source],
			})}
		<title>{data?.title ?? 'swap quote timestamp'} • swap quote timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'swap quote timestamp'} • swap quote timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SwapQuote_Timestamp, data.selector, {
				sources: [data.selector.source],
			})}

	<SwapQuote_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
