<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<svelte:head>
	<title>Spot quote index • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$marketPrices',
	})
		.$$marketPrices({
			sources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
			],
			limit: 96,
		})}

	<MarketPricesView
		href={resolve('/(assets)/coins/prices')}
		title='Spot quote index'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='market-prices'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
