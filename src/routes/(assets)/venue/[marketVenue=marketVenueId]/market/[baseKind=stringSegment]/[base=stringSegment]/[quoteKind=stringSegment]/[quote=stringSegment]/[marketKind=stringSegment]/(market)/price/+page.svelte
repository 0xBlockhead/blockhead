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
		data,
		params,
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
	<title>{(data.title ?? (pageSelection.entity == null ? 'Market price' : 'Market price'))} • Market price • Blockhead</title>
</svelte:head>


<Page>
	<MarketPriceView
		href={
			resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price', {
				marketVenue: params.marketVenue,
				baseKind: params.baseKind,
				base: params.base,
				quoteKind: params.quoteKind,
				quote: params.quote,
				marketKind: params.marketKind,
			})
		}
		selection={pageSelection}
	/>
</Page>
