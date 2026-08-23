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
	import BlockheadLocalMediaIngest_TimestampView from '$/views/BlockheadLocalMediaIngest_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLocalMediaIngest_Timestamp, {
					$ingest: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						status: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'local media ingest timestamp' : pageSelection.entity.status || 'local media ingest timestamp')} • local media ingest timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'local media ingest timestamp'} • local media ingest timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLocalMediaIngest_Timestamp, {
					$ingest: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						status: true,
					},
				}))}

		<BlockheadLocalMediaIngest_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
