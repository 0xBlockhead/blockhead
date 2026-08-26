<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidVault, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid vault'} • hyperliquid vault • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid vault'} • hyperliquid vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidVaultView
		selection={pageSelection}
	/>
	{/if}
</Page>
