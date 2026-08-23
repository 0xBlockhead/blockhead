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
	import BlockheadLogosBlockchainNodeState_TimestampView from '$/views/BlockheadLogosBlockchainNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLogosBlockchainNodeState_Timestamp, {
				$nodeState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead Logos blockchain node state timestamp')} • blockhead Logos blockchain node state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Logos blockchain node state timestamp'} • blockhead Logos blockchain node state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLogosBlockchainNodeState_Timestamp, {
				$nodeState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadLogosBlockchainNodeState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
