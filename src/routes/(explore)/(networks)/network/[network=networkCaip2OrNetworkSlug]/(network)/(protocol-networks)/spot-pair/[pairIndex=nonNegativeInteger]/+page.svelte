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
	import HyperliquidSpotPairView from '$/views/HyperliquidSpotPairView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hyperliquid spot pair'} • hyperliquid spot pair • Blockhead</title>
</svelte:head>


<Page>
	<HyperliquidSpotPairView
		selection={
			select(EntityType.HyperliquidSpotPair, {
				$network: data.selector,
				pairIndex: Number(params.pairIndex),
			})
		}
	/>
</Page>
