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
	import StellarTradeView from '$/views/StellarTradeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarTrade, {
				$network: data.selector,
				tradeId: params.tradeId,
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'stellar trade'} • stellar trade • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar trade'} • stellar trade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarTrade, {
				$network: data.selector,
				tradeId: params.tradeId,
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<StellarTradeView
		selection={pageSelection}
	/>
	{/if}
</Page>
