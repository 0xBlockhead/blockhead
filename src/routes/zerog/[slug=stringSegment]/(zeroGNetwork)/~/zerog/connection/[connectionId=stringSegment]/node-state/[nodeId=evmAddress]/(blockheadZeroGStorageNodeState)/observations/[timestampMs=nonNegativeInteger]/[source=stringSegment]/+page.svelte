<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import BlockheadZeroGStorageNodeState_TimestampView from '$/views/BlockheadZeroGStorageNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZeroGStorageNodeState_Timestamp, {
					$nodeState: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead zero g storage node state timestamp')} • blockhead zero g storage node state timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead zero g storage node state timestamp'} • blockhead zero g storage node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZeroGStorageNodeState_Timestamp, {
					$nodeState: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<BlockheadZeroGStorageNodeState_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
