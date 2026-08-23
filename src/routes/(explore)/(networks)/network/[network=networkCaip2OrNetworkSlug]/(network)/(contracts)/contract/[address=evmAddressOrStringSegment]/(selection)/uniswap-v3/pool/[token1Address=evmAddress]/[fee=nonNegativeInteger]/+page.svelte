<!-- Generated from APP.ts. -->

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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.UniswapV3Pool, {
				$token0: data.selector,
				$token1: {
					$network: data.selector.$network,
					address: params.token1Address,
				},
				fee: Number(params.fee),
			}, {
				sources: [
					Source.Voltaire_JsonRpc,
					Source.UniswapContracts_Evm,
				],
				fields: {
					poolAddress: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Uniswap V3 pool' : pageSelection.entity.poolAddress || 'Uniswap V3 pool')} • Uniswap V3 pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Uniswap V3 pool'} • Uniswap V3 pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.UniswapV3Pool, {
				$token0: data.selector,
				$token1: {
					$network: data.selector.$network,
					address: params.token1Address,
				},
				fee: Number(params.fee),
			}, {
				sources: [
					Source.Voltaire_JsonRpc,
					Source.UniswapContracts_Evm,
				],
				fields: {
					poolAddress: true,
				},
			})}

	<UniswapV3PoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
