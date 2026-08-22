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

	const pageSelection = $derived(select(EntityType.BlockheadLocalMediaIngest, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			fileName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLocalMediaIngestView from '$/views/BlockheadLocalMediaIngestView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.ingestId ?? '') || 'local media ingest' : (pageSelection.entity.fileName ?? '') || pageSelection.entitySelector.ingestId || 'local media ingest')} • local media ingest • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLocalMediaIngestView
		selection={pageSelection}
	/>
</Page>
