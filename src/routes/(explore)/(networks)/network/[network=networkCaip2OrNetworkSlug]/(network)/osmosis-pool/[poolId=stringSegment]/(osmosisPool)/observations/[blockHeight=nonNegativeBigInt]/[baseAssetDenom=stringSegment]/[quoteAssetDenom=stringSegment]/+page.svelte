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
	import OsmosisPool_TimestampView from '$/views/OsmosisPool_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.OsmosisPool_Timestamp, {
				$pool: data.selector,
				blockHeight: BigInt(params.blockHeight),
				baseAssetDenom: params.baseAssetDenom,
				quoteAssetDenom: params.quoteAssetDenom,
			}, {
				sources: [
					Source.Osmosis_LCD_Rest,
				],
			})}
		<title>{data?.title ?? ([pageSelection.entitySelector.baseAssetDenom, pageSelection.entitySelector.quoteAssetDenom].filter(Boolean).join(' ') || 'Osmosis pool timestamp')} • Osmosis pool timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Osmosis pool timestamp'} • Osmosis pool timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.OsmosisPool_Timestamp, {
				$pool: data.selector,
				blockHeight: BigInt(params.blockHeight),
				baseAssetDenom: params.baseAssetDenom,
				quoteAssetDenom: params.quoteAssetDenom,
			}, {
				sources: [
					Source.Osmosis_LCD_Rest,
				],
			})}

	<OsmosisPool_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
