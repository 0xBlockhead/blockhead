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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.UniswapV3Pool, data.selector, {
				sources: [
					Source.Voltaire_JsonRpc,
					Source.UniswapContracts_Evm,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.poolAddress || 'Uniswap V3 pool')} • Uniswap V3 pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Uniswap V3 pool'} • Uniswap V3 pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.UniswapV3Pool, data.selector, {
				sources: [
					Source.Voltaire_JsonRpc,
					Source.UniswapContracts_Evm,
				],
			})}

	<UniswapV3PoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
