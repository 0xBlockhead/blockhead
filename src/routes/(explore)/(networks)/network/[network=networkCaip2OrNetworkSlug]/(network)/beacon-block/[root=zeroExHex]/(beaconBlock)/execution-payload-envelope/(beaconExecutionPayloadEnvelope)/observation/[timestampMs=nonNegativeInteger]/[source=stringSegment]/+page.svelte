<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconExecutionPayloadEnvelope_Timestamp, {
		$envelope: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionPayloadEnvelope_TimestampView from '$/views/BeaconExecutionPayloadEnvelope_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Beacon execution payload envelope observation')} • Beacon execution payload envelope observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution payload envelope observation'} • Beacon execution payload envelope observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconExecutionPayloadEnvelope_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
