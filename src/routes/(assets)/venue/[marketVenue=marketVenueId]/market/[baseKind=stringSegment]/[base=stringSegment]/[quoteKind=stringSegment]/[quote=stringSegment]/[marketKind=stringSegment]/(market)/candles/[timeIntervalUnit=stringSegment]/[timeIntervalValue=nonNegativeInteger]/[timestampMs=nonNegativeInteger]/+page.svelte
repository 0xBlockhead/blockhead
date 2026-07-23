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

	const pageSelection = $derived(select(EntityType.Market_TimeInterval_Timestamp, {
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}, {
		fields: {
			close: true,
			open: true,
			high: true,
			low: true,
			quoteVolume: true,
			$parentMarket: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [{
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}.timeInterval == null ? '' : String(`${({
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}.timeInterval).value}${({
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}.timeInterval).unit}`)].filter(Boolean).join(' ') || 'OHLC candle' : [({ ...{
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}, ...pageSelection.entity }).timeInterval == null ? '' : String(`${(({ ...{
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}, ...pageSelection.entity }).timeInterval).value}${(({ ...{
		$market: data.selector,
		timeInterval: {
			unit: params.timeIntervalUnit,
			value: params.timeIntervalValue,
		},
		timestampMs: Number(params.timestampMs),
	}, ...pageSelection.entity }).timeInterval).unit}`)].filter(Boolean).join(' ') || 'OHLC candle'))} • OHLC candle • Blockhead</title>
</svelte:head>


<Page>
	<Market_TimeInterval_TimestampView
		href={
			resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', {
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
		selection={pageSelection}
	/>
</Page>
