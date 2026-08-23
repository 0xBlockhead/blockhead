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
	import BlockheadWakuMessageObservation_TimestampView from '$/views/BlockheadWakuMessageObservation_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadWakuMessageObservation_Timestamp, {
					$nodeState: data.selector,
					messageHash: params.messageHash,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.messageHash || 'blockhead waku message observation timestamp')} • blockhead waku message observation timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead waku message observation timestamp'} • blockhead waku message observation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadWakuMessageObservation_Timestamp, {
					$nodeState: data.selector,
					messageHash: params.messageHash,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<BlockheadWakuMessageObservation_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
