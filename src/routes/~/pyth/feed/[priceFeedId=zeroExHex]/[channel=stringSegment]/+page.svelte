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

	const pageSelection = $derived(select(EntityType.PythPriceFeed, data.selector, {
		sources: [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
			Source.Pyth_EvmContract,
			Source.Pyth_SolanaProgram,
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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.priceFeedId ?? '') || 'Pyth price feed' : (pageSelection.entity.symbol ?? '') || pageSelection.entitySelector.priceFeedId || 'Pyth price feed')} • Pyth price feed • Blockhead</title>
</svelte:head>


<Page>
	<PythPriceFeedView
		selection={pageSelection}
	/>
</Page>
