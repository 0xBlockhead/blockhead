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
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<svelte:head>
	<title>OHLC candle • Blockhead</title>
</svelte:head>


<Page>
	<Market_TimeInterval_TimestampView
		href={
			resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]', {
				marketVenue: params.marketVenue,
				baseKind: params.baseKind,
				base: params.base,
				quoteKind: params.quoteKind,
				quote: params.quote,
				marketKind: params.marketKind,
				timeIntervalUnit: params.timeIntervalUnit,
				timeIntervalValue: params.timeIntervalValue,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.Market_TimeInterval_Timestamp, data.selector, {
				fields: {
					close: true,
					open: true,
					high: true,
					low: true,
					quoteVolume: true,
					$parentMarket: true,
				},
			})
		}
	/>
</Page>
