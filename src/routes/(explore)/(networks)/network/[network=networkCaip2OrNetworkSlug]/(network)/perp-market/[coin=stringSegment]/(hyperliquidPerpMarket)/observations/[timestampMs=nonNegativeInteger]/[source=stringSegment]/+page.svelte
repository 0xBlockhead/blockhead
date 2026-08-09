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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidPerpMarket_TimestampView from '$/views/HyperliquidPerpMarket_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid perp market timestamp'} • hyperliquid perp market timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidPerpMarket_TimestampView
		selection={
			select(EntityType.HyperliquidPerpMarket_Timestamp, {
				$perpMarket: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
