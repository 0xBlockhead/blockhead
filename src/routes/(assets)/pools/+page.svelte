<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	const collectionHref = resolve('/(assets)/pools')
	const collection0Selection = $derived(select(EntityType._Global, {
		scope: '$$liquidityPools',
	})
		.$$liquidityPools({
			sources: [
				Source.Dexscreener_Rest,
			],
			limit: 300,
		}))
	const collection1Selection = $derived(select(EntityType._Global, {
		scope: '$$uniswapV3Pools',
	})
		.$$uniswapV3Pools({
			sources: [
				Source.Voltaire_JsonRpc,
				Source.UniswapContracts_Evm,
			],
			limit: 64,
		}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
	import UniswapV3PoolsView from '$/views/UniswapV3PoolsView.svelte'
</script>


<svelte:head>
	<title>Collections • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPoolsView
		href={collectionHref}
		selection={collection0Selection}
		countResource={collection0Selection.count}
		id='liquidity-pools'
	/>

	<UniswapV3PoolsView
		href={collectionHref}
		selection={collection1Selection}
		countResource={collection1Selection.count}
		id='uniswap-v3-pools'
	/>
</Page>
