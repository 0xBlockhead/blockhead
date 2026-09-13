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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LiquidityPool_Amm_EvmBlock, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPool_Amm_EvmBlockView from '$/views/LiquidityPool_Amm_EvmBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.sourceRevision || 'AMM pool observation')} • AMM pool observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AMM pool observation'} • AMM pool observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LiquidityPool_Amm_EvmBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
