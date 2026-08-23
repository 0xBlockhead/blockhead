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
	import BlockheadCodexStoredData_TimestampView from '$/views/BlockheadCodexStoredData_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCodexStoredData_Timestamp, {
				$storedData: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead codex stored data timestamp')} • blockhead codex stored data timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead codex stored data timestamp'} • blockhead codex stored data timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCodexStoredData_Timestamp, {
				$storedData: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadCodexStoredData_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
