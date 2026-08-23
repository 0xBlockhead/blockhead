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
	import BlockheadQuilibriumNodeState_TimestampView from '$/views/BlockheadQuilibriumNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadQuilibriumNodeState_Timestamp, {
					$nodeState: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead quilibrium node state timestamp')} • blockhead quilibrium node state timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead quilibrium node state timestamp'} • blockhead quilibrium node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadQuilibriumNodeState_Timestamp, {
					$nodeState: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<BlockheadQuilibriumNodeState_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
