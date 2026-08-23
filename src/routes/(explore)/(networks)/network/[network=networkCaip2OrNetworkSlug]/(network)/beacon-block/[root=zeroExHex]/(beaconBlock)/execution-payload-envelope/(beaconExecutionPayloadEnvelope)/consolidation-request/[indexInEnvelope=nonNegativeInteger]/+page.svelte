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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconExecutionConsolidationRequest, {
		$envelope: data.selector,
		indexInEnvelope: Number(params.indexInEnvelope),
	}, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionConsolidationRequestView from '$/views/BeaconExecutionConsolidationRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInEnvelope ?? '') ? 'Consolidation request #' + String(pageSelection.entitySelector.indexInEnvelope ?? '') : '') || 'Beacon execution consolidation request')} • Beacon execution consolidation request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution consolidation request'} • Beacon execution consolidation request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconExecutionConsolidationRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
