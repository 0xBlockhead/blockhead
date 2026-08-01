<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LiquidityPool, data.selector, {
		sources: [
			Source.Dexscreener_Rest,
		],
		fields: {
			$baseToken: true,
			$quoteToken: true,
			$hooks: true,
			fee: true,
			tickSpacing: true,
			v4PoolId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.id || 'liquidity pool')} • liquidity pool • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPoolView
		selection={pageSelection}
	/>
</Page>
