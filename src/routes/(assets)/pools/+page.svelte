<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<svelte:head>
	<title>Liquidity pools • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPoolsView
		href={resolve('/(assets)/pools')}
		title='Liquidity pools'
		selection={
			select(EntityType._Global, {
				scope: '$$liquidityPools',
			})[EntityProxyField]<EntityType.LiquidityPool>('$$liquidityPools', {
				sources: [
					Source.Dexscreener_OpenApi,
				],
				limit: 300,
			})
		}
		id='liquidity-pools'
	/>
</Page>
