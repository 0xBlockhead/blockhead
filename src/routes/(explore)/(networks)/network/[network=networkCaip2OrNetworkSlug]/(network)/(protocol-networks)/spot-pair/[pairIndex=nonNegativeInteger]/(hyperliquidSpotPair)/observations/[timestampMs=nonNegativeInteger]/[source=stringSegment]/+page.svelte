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
	import HyperliquidSpotPair_TimestampView from '$/views/HyperliquidSpotPair_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid spot pair timestamp'} • hyperliquid spot pair timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidSpotPair_TimestampView
		selection={
			select(EntityType.HyperliquidSpotPair_Timestamp, {
				$spotPair: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
