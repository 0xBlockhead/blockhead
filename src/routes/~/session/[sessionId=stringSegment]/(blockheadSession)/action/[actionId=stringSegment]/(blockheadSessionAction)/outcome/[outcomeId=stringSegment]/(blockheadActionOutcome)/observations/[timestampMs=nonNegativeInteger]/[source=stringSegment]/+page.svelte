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
	import BlockheadActionOutcome_TimestampView from '$/views/BlockheadActionOutcome_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadActionOutcome_Timestamp, {
					$outcome: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						status: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action outcome timestamp' : pageSelection.entity.status || 'blockhead action outcome timestamp')} • blockhead action outcome timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead action outcome timestamp'} • blockhead action outcome timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadActionOutcome_Timestamp, {
					$outcome: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						status: true,
					},
				}))}

		<BlockheadActionOutcome_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
