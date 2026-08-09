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
	import HyperliquidFillView from '$/views/HyperliquidFillView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid fill'} • hyperliquid fill • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidFillView
		selection={
			select(EntityType.HyperliquidFill, {
				$account: data.selector,
				tid: BigInt(params.tid),
			})
		}
	/>
</Page>
