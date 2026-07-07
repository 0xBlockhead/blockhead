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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


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
			select(EntityType.Market_TimeInterval_Timestamp, {
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
				timeInterval: {
					unit: decodeURIComponent(params.timeIntervalUnit),
					value: Number(params.timeIntervalValue),
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
			})
		}
	/>
</Page>
