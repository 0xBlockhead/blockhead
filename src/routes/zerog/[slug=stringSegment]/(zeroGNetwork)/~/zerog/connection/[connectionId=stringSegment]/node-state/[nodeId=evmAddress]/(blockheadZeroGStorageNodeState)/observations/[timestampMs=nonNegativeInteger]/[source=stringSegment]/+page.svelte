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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadZeroGStorageNodeState_Timestamp, {
		$nodeState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZeroGStorageNodeState_TimestampView from '$/views/BlockheadZeroGStorageNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead zero g storage node state timestamp')} • blockhead zero g storage node state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead zero g storage node state timestamp'} • blockhead zero g storage node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadZeroGStorageNodeState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
