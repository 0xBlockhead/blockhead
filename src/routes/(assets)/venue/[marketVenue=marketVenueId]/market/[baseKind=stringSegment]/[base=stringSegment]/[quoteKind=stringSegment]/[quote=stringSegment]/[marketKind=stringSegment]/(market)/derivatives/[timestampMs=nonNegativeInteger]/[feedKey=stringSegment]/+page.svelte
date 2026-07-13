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

	const pageSelection = $derived(select(EntityType.Market_Derivative_Timestamp, {
		$market: data.selector,
		timestampMs: Number(params.timestampMs),
		feedKey: params.feedKey,
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.feedKey) ?? '')].filter(Boolean).join(' ') || 'market derivative timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).feedKey) ?? '')].filter(Boolean).join(' ') || 'market derivative timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • market derivative timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Market_Derivative_TimestampView
		href={
			resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
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
		selection={pageSelection}
	/>
</Page>
