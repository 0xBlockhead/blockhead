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
	import HyperliquidTransaction_TimestampView from '$/views/HyperliquidTransaction_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid transaction timestamp'} • hyperliquid transaction timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidTransaction_TimestampView
		selection={
			select(EntityType.HyperliquidTransaction_Timestamp, {
				$transaction: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
