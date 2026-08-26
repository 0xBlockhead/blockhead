<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MarketAsset, {
		kind: params.kind,
		assetKey: params.assetKey,
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
