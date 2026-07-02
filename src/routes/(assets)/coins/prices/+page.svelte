<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<svelte:head>
	<title>Spot quote index • Blockhead</title>
</svelte:head>


<Page>
	<MarketPricesView
		href={resolve('/(assets)/coins/prices')}
		title='Spot quote index'
		selection={
			select(EntityType._Global, {
				scope: '$$marketPrices',
			})[EntityProxyField]<EntityType.MarketPrice>('$$marketPrices', {
				sources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_OpenApi,
					Source.Defillama_OpenApi,
				],
				limit: 96,
			})
		}
		id='MarketPricesView-page'
	/>
</Page>
