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

	const pageSelection = $derived(select(EntityType.Market_Timestamp, {
		$market: data.selector,
		timestampMs: Number(params.timestampMs),
		feedKey: decodeURIComponent(params.feedKey),
	}, {
		fields: {
			price: true,
			transport: true,
			providerAssetId: true,
			caip19: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.feedKey) ?? '')].filter(Boolean).join(' ') || 'market timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).feedKey) ?? '')].filter(Boolean).join(' ') || 'market timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • market timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Market_TimestampView
		href={
			resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
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
