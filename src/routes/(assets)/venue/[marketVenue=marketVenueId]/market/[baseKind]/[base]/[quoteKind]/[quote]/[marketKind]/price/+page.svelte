<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<Page>
	<MarketPriceView
		href={
			resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price', {
				marketVenue: params.marketVenue,
				baseKind: params.baseKind,
				base: params.base,
				quoteKind: params.quoteKind,
				quote: params.quote,
				marketKind: params.marketKind,
			})
		}
		selection={
			select(EntityType.MarketPrice, {
				$market: {
					$base: (
					params.baseKind === 'coin' ?
						{
							kind: 'Coin',
							$coin: {
								coinId: decodeURIComponent(params.base),
							},
						}
					:
						{
							kind: 'Currency',
							$currency: {
								iso4217: decodeURIComponent(params.base),
							},
						}
					),
					$quote: (
					params.quoteKind === 'coin' ?
						{
							kind: 'Coin',
							$coin: {
								coinId: decodeURIComponent(params.quote),
							},
						}
					:
						{
							kind: 'Currency',
							$currency: {
								iso4217: decodeURIComponent(params.quote),
							},
						}
					),
					$marketVenue: {
						marketVenueId: decodeURIComponent(params.marketVenue),
					},
					marketKind: decodeURIComponent(params.marketKind),
				},
			}, {
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
			})
		}
	/>
</Page>
