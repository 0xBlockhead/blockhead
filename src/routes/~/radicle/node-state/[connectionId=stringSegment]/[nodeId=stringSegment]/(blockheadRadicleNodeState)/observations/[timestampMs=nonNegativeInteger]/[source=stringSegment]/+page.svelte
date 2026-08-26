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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadRadicleNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeState_TimestampView from '$/views/BlockheadRadicleNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead radicle node state timestamp')} • blockhead radicle node state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle node state timestamp'} • blockhead radicle node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadRadicleNodeState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
