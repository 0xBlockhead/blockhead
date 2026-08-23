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
	import BlockheadLightningNodeState_TimestampView from '$/views/BlockheadLightningNodeState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLightningNodeState_Timestamp, {
					$localNodeState: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'local LND node-state observation')} • local LND node-state observation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'local LND node-state observation'} • local LND node-state observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLightningNodeState_Timestamp, {
					$localNodeState: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<BlockheadLightningNodeState_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
