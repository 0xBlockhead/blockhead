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
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<svelte:head>
	<title>market derivative timestamp • Blockhead</title>
</svelte:head>


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
			select(EntityType.Market_Derivative_Timestamp, data.selector, {
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
