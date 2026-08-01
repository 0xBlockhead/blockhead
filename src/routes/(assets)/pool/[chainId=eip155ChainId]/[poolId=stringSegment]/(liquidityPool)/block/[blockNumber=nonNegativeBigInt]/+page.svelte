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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LiquidityPool_Block, {
		$liquidityPool: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			id: params.poolId,
		},
		blockNumber: BigInt(params.blockNumber),
	}, {
		sources: [
			Source.Dexscreener_Rest,
		],
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_BlockView from '$/views/LiquidityPool_BlockView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.blockNumber) || 'liquidity pool block'} • liquidity pool block • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPool_BlockView
		selection={pageSelection}
	/>
</Page>
