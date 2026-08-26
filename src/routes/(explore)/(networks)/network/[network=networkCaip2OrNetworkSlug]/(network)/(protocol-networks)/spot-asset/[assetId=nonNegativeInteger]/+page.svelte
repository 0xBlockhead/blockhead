<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidSpotAsset, {
		$network: data.selector.$network,
		assetId: Number(params.assetId),
	}, {
		sources: [
			Source.Hyperliquid,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidSpotAssetView from '$/views/HyperliquidSpotAssetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.assetId ?? '') || 'hyperliquid spot asset' : (pageSelection.entity.name ?? '') || String(pageSelection.entitySelector.assetId) || 'hyperliquid spot asset')} • hyperliquid spot asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid spot asset'} • hyperliquid spot asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidSpotAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
