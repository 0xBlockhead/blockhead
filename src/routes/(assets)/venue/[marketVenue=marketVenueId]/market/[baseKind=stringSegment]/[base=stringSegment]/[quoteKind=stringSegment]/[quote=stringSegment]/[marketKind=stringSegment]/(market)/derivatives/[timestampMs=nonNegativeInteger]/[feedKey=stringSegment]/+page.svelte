<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Market_Derivative_Timestamp, {
		$market: data.selector,
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.feedKey || 'market derivative timestamp')} • market derivative timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Market_Derivative_TimestampView
		selection={pageSelection}
	/>
</Page>
