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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidOrder, data.selector))}
			<title>{data?.title ?? 'hyperliquid order'} • hyperliquid order • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hyperliquid order'} • hyperliquid order • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HyperliquidOrder, data.selector))}

		<HyperliquidOrderView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
