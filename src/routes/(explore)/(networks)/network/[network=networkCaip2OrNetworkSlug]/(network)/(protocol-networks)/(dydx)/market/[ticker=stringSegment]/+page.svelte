<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.DydxChainMarket, data.selector, {
		sources: [
			Source.DydxIndexer,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import DydxChainMarketView from '$/views/DydxChainMarketView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.ticker || 'dydx chain market')} • dydx chain market • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'dydx chain market'} • dydx chain market • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<DydxChainMarketView
		selection={pageSelection}
	/>
	{/if}
</Page>
