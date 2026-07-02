<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<svelte:head>
	<title>Market price • Blockhead</title>
</svelte:head>


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
			select(EntityType.MarketPrice, data.selector, {
				fields: {
					$parentMarket: true,
				},
			})
		}
	/>
</Page>
