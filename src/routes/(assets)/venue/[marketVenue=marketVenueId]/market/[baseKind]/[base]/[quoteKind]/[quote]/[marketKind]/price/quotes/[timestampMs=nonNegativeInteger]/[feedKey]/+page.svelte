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
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<Page>
	<Market_TimestampView
		href={
			resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
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
			select(EntityType.Market_Timestamp, {
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
					price: true,
					transport: true,
					providerAssetId: true,
					caip19: true,
				},
			})
		}
	/>
</Page>
