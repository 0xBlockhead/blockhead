<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_BlockView from '$/views/LiquidityPool_BlockView.svelte'
</script>


<svelte:head>
	<title>Liquidity pool block • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPool_BlockView
		href={
			resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]/block/[blockNumber=nonNegativeInteger]', {
				chainId: params.chainId,
				poolId: params.poolId,
				blockNumber: params.blockNumber,
			})
		}
		selection={
			select(EntityType.LiquidityPool_Block, data.selector, {
				fields: {
					tick: true,
					$parentLiquidityPool: true,
					sqrtPriceX96: true,
					liquidity: true,
					feeProtocol: true,
					unlocked: true,
					observationIndex: true,
					observationCardinality: true,
					observationCardinalityNext: true,
				},
			})
		}
	/>
</Page>
