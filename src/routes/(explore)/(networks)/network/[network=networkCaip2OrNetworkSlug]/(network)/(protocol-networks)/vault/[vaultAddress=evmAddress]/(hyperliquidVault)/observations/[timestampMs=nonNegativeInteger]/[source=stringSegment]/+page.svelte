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
	import HyperliquidVault_TimestampView from '$/views/HyperliquidVault_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hyperliquid vault timestamp'} • hyperliquid vault timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidVault_TimestampView
		selection={
			select(EntityType.HyperliquidVault_Timestamp, {
				$vault: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
