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
	import HyperliquidOrderbook_TimestampView from '$/views/HyperliquidOrderbook_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid orderbook timestamp'} • hyperliquid orderbook timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidOrderbook_TimestampView
		selection={
			select(EntityType.HyperliquidOrderbook_Timestamp, {
				$network: data.selector,
				bookKey: params.bookKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
