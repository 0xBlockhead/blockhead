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
	import HyperliquidPositionView from '$/views/HyperliquidPositionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hyperliquid position'} • hyperliquid position • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidPositionView
		selection={
			select(EntityType.HyperliquidPosition, {
				$account: data.selector,
				coin: params.coin,
			})
		}
	/>
</Page>
