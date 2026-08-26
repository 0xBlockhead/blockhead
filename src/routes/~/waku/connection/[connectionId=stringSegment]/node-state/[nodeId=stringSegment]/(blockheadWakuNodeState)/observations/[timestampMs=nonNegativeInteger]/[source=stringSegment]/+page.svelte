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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadWakuNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWakuNodeState_TimestampView from '$/views/BlockheadWakuNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead waku node state timestamp')} • blockhead waku node state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead waku node state timestamp'} • blockhead waku node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadWakuNodeState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
