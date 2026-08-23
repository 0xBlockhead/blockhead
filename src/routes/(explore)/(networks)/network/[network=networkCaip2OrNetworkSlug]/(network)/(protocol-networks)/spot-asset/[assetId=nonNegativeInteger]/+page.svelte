<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidSpotAssetView from '$/views/HyperliquidSpotAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidSpotAsset, {
				$network: data.selector.$network,
				assetId: Number(params.assetId),
			}, {
				sources: [
					Source.Hyperliquid,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.assetId ?? '') || 'hyperliquid spot asset' : (pageSelection.entity.name ?? '') || String(pageSelection.entitySelector.assetId) || 'hyperliquid spot asset')} • hyperliquid spot asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid spot asset'} • hyperliquid spot asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidSpotAsset, {
				$network: data.selector.$network,
				assetId: Number(params.assetId),
			}, {
				sources: [
					Source.Hyperliquid,
				],
				fields: {
					name: true,
				},
			})}

	<HyperliquidSpotAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
