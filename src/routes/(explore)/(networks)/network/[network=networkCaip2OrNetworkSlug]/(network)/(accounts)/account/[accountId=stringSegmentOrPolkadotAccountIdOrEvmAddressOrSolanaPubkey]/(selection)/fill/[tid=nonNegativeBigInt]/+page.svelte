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


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidFillView from '$/views/HyperliquidFillView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidFill, {
				$account: data.selector,
				tid: BigInt(params.tid),
			})}
		<title>{data?.title ?? 'hyperliquid fill'} • hyperliquid fill • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid fill'} • hyperliquid fill • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidFill, {
				$account: data.selector,
				tid: BigInt(params.tid),
			})}

	<HyperliquidFillView
		selection={pageSelection}
	/>
	{/if}
</Page>
