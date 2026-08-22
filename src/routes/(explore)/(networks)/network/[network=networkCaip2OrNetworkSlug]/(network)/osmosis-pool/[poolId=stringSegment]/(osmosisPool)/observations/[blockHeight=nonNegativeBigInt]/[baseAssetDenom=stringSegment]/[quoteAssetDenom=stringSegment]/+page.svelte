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

	const pageSelection = $derived(select(EntityType.OsmosisPool_Timestamp, {
		$pool: data.selector,
		blockHeight: BigInt(params.blockHeight),
		baseAssetDenom: params.baseAssetDenom,
		quoteAssetDenom: params.quoteAssetDenom,
	}, {
		sources: [
			Source.Osmosis_LCD_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OsmosisPool_TimestampView from '$/views/OsmosisPool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ([pageSelection.entitySelector.baseAssetDenom, pageSelection.entitySelector.quoteAssetDenom].filter(Boolean).join(' ') || 'Osmosis pool timestamp')} • Osmosis pool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<OsmosisPool_TimestampView
		selection={pageSelection}
	/>
</Page>
