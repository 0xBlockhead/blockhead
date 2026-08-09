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
	import HyperliquidOrder_TimestampView from '$/views/HyperliquidOrder_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid order timestamp'} • hyperliquid order timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidOrder_TimestampView
		selection={
			select(EntityType.HyperliquidOrder_Timestamp, {
				$order: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
