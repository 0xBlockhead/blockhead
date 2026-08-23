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


	// Components
	import Page from '$/components/Page.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PythPriceFeed, data.selector, {
				sources: [
					Source.PythBenchmarks_Rest,
					Source.PythHermes_Rest,
				],
				fields: {
					symbol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.priceFeedId ?? '') || 'Pyth price feed' : (pageSelection.entity.symbol ?? '') || pageSelection.entitySelector.priceFeedId || 'Pyth price feed')} • Pyth price feed • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Pyth price feed'} • Pyth price feed • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PythPriceFeed, data.selector, {
				sources: [
					Source.PythBenchmarks_Rest,
					Source.PythHermes_Rest,
				],
				fields: {
					symbol: true,
				},
			})}

	<PythPriceFeedView
		selection={pageSelection}
	/>
	{/if}
</Page>
