<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PythPriceFeed, data.selector, {
		sources: [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
		],
		fields: {
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.priceFeedId ?? '') || 'Pyth price feed' : (pageSelection.entity.symbol ?? '') || pageSelection.entitySelector.priceFeedId || 'Pyth price feed')} • Pyth price feed • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Pyth price feed'} • Pyth price feed • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PythPriceFeedView
		selection={pageSelection}
	/>
	{/if}
</Page>
