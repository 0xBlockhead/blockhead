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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BridgeTransfer_Timestamp, {
		$transfer: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.observationSource,
		eventKind: params.eventKind,
	}, {
		sources: [params.observationSource],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransfer_TimestampView from '$/views/BridgeTransfer_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bridge transfer timestamp')} • bridge transfer timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bridge transfer timestamp'} • bridge transfer timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BridgeTransfer_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
