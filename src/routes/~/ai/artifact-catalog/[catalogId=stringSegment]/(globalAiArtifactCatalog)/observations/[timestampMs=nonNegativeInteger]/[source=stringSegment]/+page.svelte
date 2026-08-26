<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalAiArtifactCatalog_Timestamp, {
		$catalog: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAiArtifactCatalog_TimestampView from '$/views/_GlobalAiArtifactCatalog_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'global AI artifact catalog timestamp')} • global AI artifact catalog timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global AI artifact catalog timestamp'} • global AI artifact catalog timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalAiArtifactCatalog_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
