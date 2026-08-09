<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CardanoNativeAsset, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoNativeAssetView from '$/views/CardanoNativeAssetView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.assetName || pageSelection.entitySelector.policyId || 'Cardano native asset')} • Cardano native asset • Blockhead</title>
</svelte:head>


<Page>
	<CardanoNativeAssetView
		selection={pageSelection}
	/>
</Page>
