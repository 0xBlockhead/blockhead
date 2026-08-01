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
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Market price'} • Market price • Blockhead</title>
</svelte:head>


<Page>
	<MarketPriceView
		selection={
			select(EntityType.MarketPrice, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_Rest,
					Source.Defillama_Rest,
					Source.TradingView_Rest,
				],
				fields: {
					$parentMarket: true,
				},
			})
		}
	/>
</Page>
