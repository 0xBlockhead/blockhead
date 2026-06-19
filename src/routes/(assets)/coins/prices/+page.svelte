<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<svelte:head>
	<title>Spot quote index · Coins</title>
</svelte:head>


<Page>
	<p data-text="muted">
		Point-in-time spot and index readings for catalog markets—not venue order books.
		Each row opens the market pair for quote history and OHLC ranges.
	</p>

	<MarketPricesView
		href={resolve('/markets')}
		collapsible={false}
		selection={select(
			EntityType._Global,
			{ scope: '$$marketPrices' }
		).$$marketPrices}
		id="coin-prices-page"
		limit={96}
		sources={[
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coingecko_OpenApi,
			Source.CoinMarketCap_Rest,
			Source.Coinpaprika_OpenApi,
			Source.Defillama_OpenApi,
		]}
		title="Spot quote index"
	/>
</Page>
