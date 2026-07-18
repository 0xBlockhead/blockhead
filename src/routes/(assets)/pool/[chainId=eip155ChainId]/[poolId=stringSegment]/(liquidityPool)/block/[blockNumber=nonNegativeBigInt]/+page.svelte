<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
					reference: Number(params.chainId),
				},
			},
			id: params.poolId,
		},
		blockNumber: BigInt(params.blockNumber),
	}, {
		sources: [
			Source.Dexscreener_OpenApi,
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity pool block' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity pool block'))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_BlockView from '$/views/LiquidityPool_BlockView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • liquidity pool block • Blockhead</title>
</svelte:head>


<Page>
	<LiquidityPool_BlockView
		href={
			resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/block/[blockNumber=nonNegativeBigInt]', {
				chainId: params.chainId,
				poolId: params.poolId,
				blockNumber: params.blockNumber,
			})
		}
		selection={pageSelection}
	/>
</Page>
