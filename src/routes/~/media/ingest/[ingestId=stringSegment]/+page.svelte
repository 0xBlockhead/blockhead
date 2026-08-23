<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLocalMediaIngestView from '$/views/BlockheadLocalMediaIngestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLocalMediaIngest, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					fileName: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.ingestId ?? '') || 'local media ingest' : (pageSelection.entity.fileName ?? '') || pageSelection.entitySelector.ingestId || 'local media ingest')} • local media ingest • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'local media ingest'} • local media ingest • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLocalMediaIngest, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					fileName: true,
				},
			})}

	<BlockheadLocalMediaIngestView
		selection={pageSelection}
	/>
	{/if}
</Page>
