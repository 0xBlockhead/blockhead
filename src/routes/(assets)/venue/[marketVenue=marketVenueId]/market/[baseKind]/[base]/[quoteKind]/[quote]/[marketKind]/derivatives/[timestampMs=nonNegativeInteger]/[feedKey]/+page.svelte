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
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<Page>
	<Market_Derivative_TimestampView
		href={
			resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey]', {
				marketVenue: params.marketVenue,
				baseKind: params.baseKind,
				base: params.base,
				quoteKind: params.quoteKind,
				quote: params.quote,
				marketKind: params.marketKind,
				timestampMs: params.timestampMs,
				feedKey: params.feedKey,
			})
		}
		selection={
			select(EntityType.Market_Derivative_Timestamp, {
				$market: {
					$marketVenue: {
						marketVenueId: params.marketVenue,
					},
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
					marketKind: params.marketKind,
				},
				timestampMs: Number(params.timestampMs),
				feedKey: decodeURIComponent(params.feedKey),
			}, {
				fields: {
					markPrice: true,
					indexPrice: true,
					fundingRate: true,
					openInterestUsd: true,
					indexBasisPercent: true,
					expiredAtMs: true,
					lastTradedAtMs: true,
					providerAssetId: true,
					transport: true,
					$parentMarket: true,
				},
			})
		}
	/>
</Page>
