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
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidVault, data.selector)}
		<title>{data?.title ?? 'hyperliquid vault'} • hyperliquid vault • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid vault'} • hyperliquid vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidVault, data.selector)}

	<HyperliquidVaultView
		selection={pageSelection}
	/>
	{/if}
</Page>
