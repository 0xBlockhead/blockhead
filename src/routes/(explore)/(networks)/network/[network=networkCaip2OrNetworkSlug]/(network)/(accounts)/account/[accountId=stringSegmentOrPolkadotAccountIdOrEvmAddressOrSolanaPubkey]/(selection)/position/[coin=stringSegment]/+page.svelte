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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidPosition, {
		$account: data.selector,
		coin: params.coin,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidPositionView from '$/views/HyperliquidPositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid position'} • hyperliquid position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid position'} • hyperliquid position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
