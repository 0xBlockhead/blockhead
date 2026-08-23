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
	import GlobalAiModelCatalog_TimestampView from '$/views/_GlobalAiModelCatalog_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType._GlobalAiModelCatalog_Timestamp, {
				$catalog: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'global AI model catalog timestamp')} • global AI model catalog timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global AI model catalog timestamp'} • global AI model catalog timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType._GlobalAiModelCatalog_Timestamp, {
				$catalog: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<GlobalAiModelCatalog_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
