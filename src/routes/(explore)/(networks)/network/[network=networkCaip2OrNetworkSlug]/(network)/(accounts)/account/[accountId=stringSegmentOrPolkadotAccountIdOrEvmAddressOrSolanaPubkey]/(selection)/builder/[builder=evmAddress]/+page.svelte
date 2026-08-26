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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidBuilderApproval, {
		$account: data.selector,
		builder: params.builder,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidBuilderApprovalView from '$/views/HyperliquidBuilderApprovalView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid builder approval'} • hyperliquid builder approval • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid builder approval'} • hyperliquid builder approval • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidBuilderApprovalView
		selection={pageSelection}
	/>
	{/if}
</Page>
