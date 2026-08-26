<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3PoolsView from '$/views/UniswapV3PoolsView.svelte'
</script>


<svelte:head>
	<title>Uniswap V3 pools • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$uniswapV3Pools',
	})
		.$$uniswapV3Pools({
			sources: [
				Source.Voltaire_JsonRpc,
				Source.UniswapContracts_Evm,
			],
			limit: 64,
		})}

	<UniswapV3PoolsView
		href={resolve('/(assets)/uniswap-v3/pools')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='uniswap-v3-pools'
	/>
</Page>
