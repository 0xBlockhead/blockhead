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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionPayloadEnvelopeView from '$/views/BeaconExecutionPayloadEnvelopeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconExecutionPayloadEnvelope, data.selector, {
					sources: [
						Source.Beacon_Rest,
					],
					fields: {
						blockNumber: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Beacon execution payload envelope' : 'Execution block ' + String(pageSelection.entity.blockNumber))} • Beacon execution payload envelope • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Beacon execution payload envelope'} • Beacon execution payload envelope • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconExecutionPayloadEnvelope, data.selector, {
					sources: [
						Source.Beacon_Rest,
					],
					fields: {
						blockNumber: true,
					},
				}))}

		<BeaconExecutionPayloadEnvelopeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
