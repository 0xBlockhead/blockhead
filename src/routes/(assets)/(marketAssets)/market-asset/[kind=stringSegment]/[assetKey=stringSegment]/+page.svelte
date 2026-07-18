<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MarketAsset, {
		kind: params.kind,
		assetKey: params.assetKey,
	}, {
		fields: {
			Coin: {
				fields: {
					$coin: true,
				},
			},
			CoinInstance: {
				fields: {
					$coinInstance: true,
				},
			},
			Currency: {
				fields: {
					$currency: true,
				},
			},
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.assetKey) ?? '')].filter(Boolean).join(' ') || 'Market asset' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).assetKey) ?? '')].filter(Boolean).join(' ') || 'Market asset'))


	// Components
	import Page from '$/components/Page.svelte'
	import MarketAssetView from '$/views/MarketAssetView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Market asset • Blockhead</title>
</svelte:head>


<Page>
	<MarketAssetView
		href={
			resolve('/market-asset/[kind=stringSegment]/[assetKey=stringSegment]', {
				kind: params.kind,
				assetKey: params.assetKey,
			})
		}
		selection={pageSelection}
	/>
</Page>
