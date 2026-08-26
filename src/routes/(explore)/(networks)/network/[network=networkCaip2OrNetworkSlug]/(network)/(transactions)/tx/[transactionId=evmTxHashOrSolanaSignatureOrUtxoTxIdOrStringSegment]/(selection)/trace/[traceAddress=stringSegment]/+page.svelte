<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmTrace, {
		$transaction: data.selector,
		traceAddress: params.traceAddress,
	}, {
		fields: {
			index: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTraceView from '$/views/EvmTraceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'EVM trace' : (String(pageSelection.entity.index ?? '') ? 'Trace #' + String(pageSelection.entity.index ?? '') : '') || (pageSelection.entitySelector.traceAddress ?? '') || 'EVM trace')} • EVM trace • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM trace'} • EVM trace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmTraceView
		selection={pageSelection}
	/>
	{/if}
</Page>
