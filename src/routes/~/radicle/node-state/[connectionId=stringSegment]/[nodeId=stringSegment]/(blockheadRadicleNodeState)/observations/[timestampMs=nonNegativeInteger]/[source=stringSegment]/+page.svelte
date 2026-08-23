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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeState_TimestampView from '$/views/BlockheadRadicleNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadRadicleNodeState_Timestamp, {
				$nodeState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead radicle node state timestamp')} • blockhead radicle node state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle node state timestamp'} • blockhead radicle node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadRadicleNodeState_Timestamp, {
				$nodeState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadRadicleNodeState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
