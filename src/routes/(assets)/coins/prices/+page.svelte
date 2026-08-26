<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_Rest,
				Source.Defillama_Rest,
			],
			limit: 96,
		})}

	<MarketPricesView
		href={resolve('/(assets)/coins/prices')}
		title='Spot quote index'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='market-prices'
	/>
</Page>
