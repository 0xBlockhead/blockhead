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
	import HyperliquidAccount_TimestampView from '$/views/HyperliquidAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid account timestamp'} • hyperliquid account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidAccount_TimestampView
		selection={
			select(EntityType.HyperliquidAccount_Timestamp, {
				$account: data.selector,
				infoType: params.infoType,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
