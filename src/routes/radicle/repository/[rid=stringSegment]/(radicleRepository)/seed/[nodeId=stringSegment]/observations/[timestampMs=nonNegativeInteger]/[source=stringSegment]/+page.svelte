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
	import BlockheadRadicleSeedObservation_TimestampView from '$/views/BlockheadRadicleSeedObservation_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadRadicleSeedObservation_Timestamp, {
					$repository: data.selector,
					nodeId: params.nodeId,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.nodeId || 'blockhead radicle seed observation timestamp')} • blockhead radicle seed observation timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead radicle seed observation timestamp'} • blockhead radicle seed observation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadRadicleSeedObservation_Timestamp, {
					$repository: data.selector,
					nodeId: params.nodeId,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<BlockheadRadicleSeedObservation_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
