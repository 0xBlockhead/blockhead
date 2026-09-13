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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LiquidityPool_Amm_EvmBlock_InputAsset, {
		$observation: data.selector,
		ordinal: Number(params.ordinal),
	}, {
		sources: [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_Amm_EvmBlock_InputAssetView from '$/views/LiquidityPool_Amm_EvmBlock_InputAssetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Input ' + String(pageSelection.entitySelector.ordinal)} • observed pool input asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'observed pool input asset'} • observed pool input asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LiquidityPool_Amm_EvmBlock_InputAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>
