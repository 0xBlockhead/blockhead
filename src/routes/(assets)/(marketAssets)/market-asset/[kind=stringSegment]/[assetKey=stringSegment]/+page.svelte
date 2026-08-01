<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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


	// Components
	import Page from '$/components/Page.svelte'
	import MarketAssetView from '$/views/MarketAssetView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.assetKey || 'Market asset'} • Market asset • Blockhead</title>
</svelte:head>


<Page>
	<MarketAssetView
		selection={pageSelection}
	/>
</Page>
