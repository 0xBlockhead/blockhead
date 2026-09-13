<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { parse } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FinancialProtocol_Amm_EvmBlock, {
		$protocol: data.selector,
		$block: parse(params.blockSelector),
		sourceRevision: params.sourceRevision,
	}, {
		sources: [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FinancialProtocol_Amm_EvmBlockView from '$/views/FinancialProtocol_Amm_EvmBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.sourceRevision || 'AMM protocol financial observation')} • AMM protocol financial observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AMM protocol financial observation'} • AMM protocol financial observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FinancialProtocol_Amm_EvmBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
