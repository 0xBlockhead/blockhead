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
	import HyperliquidValidator_TimestampView from '$/views/HyperliquidValidator_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid validator timestamp'} • hyperliquid validator timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidValidator_TimestampView
		selection={
			select(EntityType.HyperliquidValidator_Timestamp, {
				$validator: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
