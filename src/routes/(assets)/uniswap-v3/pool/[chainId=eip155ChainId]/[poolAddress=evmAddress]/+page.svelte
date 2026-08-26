<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.UniswapV3Pool, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import UniswapV3PoolView from '$/views/UniswapV3PoolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.poolAddress || 'Uniswap V3 pool')} • Uniswap V3 pool • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Uniswap V3 pool'} • Uniswap V3 pool • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<UniswapV3PoolView
		selection={pageSelection}
	/>
	{/if}
</Page>
