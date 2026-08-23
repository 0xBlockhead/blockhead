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
	import HyperliquidValidatorView from '$/views/HyperliquidValidatorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidValidator, data.selector)}
		<title>{data?.title ?? 'hyperliquid validator'} • hyperliquid validator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid validator'} • hyperliquid validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidValidator, data.selector)}

	<HyperliquidValidatorView
		selection={pageSelection}
	/>
	{/if}
</Page>
