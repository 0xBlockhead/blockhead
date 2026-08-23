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
	import HyperliquidBuilderApprovalView from '$/views/HyperliquidBuilderApprovalView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidBuilderApproval, {
				$account: data.selector,
				builder: params.builder,
			})}
		<title>{data?.title ?? 'hyperliquid builder approval'} • hyperliquid builder approval • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid builder approval'} • hyperliquid builder approval • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidBuilderApproval, {
				$account: data.selector,
				builder: params.builder,
			})}

	<HyperliquidBuilderApprovalView
		selection={pageSelection}
	/>
	{/if}
</Page>
