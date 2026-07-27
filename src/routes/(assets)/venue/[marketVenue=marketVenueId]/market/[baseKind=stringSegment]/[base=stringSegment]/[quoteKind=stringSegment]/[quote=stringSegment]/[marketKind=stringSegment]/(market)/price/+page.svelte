<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.MarketPrice, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coingecko_OpenApi,
			Source.CoinMarketCap_Rest,
			Source.Coinpaprika_OpenApi,
			Source.Defillama_OpenApi,
			Source.Defillama_Rest,
		],
		fields: {
			$parentMarket: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ('Market price'))} • Market price • Blockhead</title>
</svelte:head>


<Page>
	<MarketPriceView
		selection={pageSelection}
	/>
</Page>
