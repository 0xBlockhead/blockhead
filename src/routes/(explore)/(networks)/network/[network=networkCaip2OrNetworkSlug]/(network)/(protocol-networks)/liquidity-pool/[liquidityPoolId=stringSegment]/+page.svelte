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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StellarLiquidityPoolView from '$/views/StellarLiquidityPoolView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar liquidity pool'} • stellar liquidity pool • Blockhead</title>
</svelte:head>


<Page>
	<StellarLiquidityPoolView
		selection={select(EntityType.StellarLiquidityPool, data.selector)}
	/>
</Page>
