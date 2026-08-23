<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionConsolidationRequestView from '$/views/BeaconExecutionConsolidationRequestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconExecutionConsolidationRequest, {
					$envelope: data.selector,
					indexInEnvelope: Number(params.indexInEnvelope),
				}, {
					sources: [
						Source.Beacon_Rest,
					],
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInEnvelope ?? '') ? 'Consolidation request #' + String(pageSelection.entitySelector.indexInEnvelope ?? '') : '') || 'Beacon execution consolidation request')} • Beacon execution consolidation request • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Beacon execution consolidation request'} • Beacon execution consolidation request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconExecutionConsolidationRequest, {
					$envelope: data.selector,
					indexInEnvelope: Number(params.indexInEnvelope),
				}, {
					sources: [
						Source.Beacon_Rest,
					],
				}))}

		<BeaconExecutionConsolidationRequestView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
