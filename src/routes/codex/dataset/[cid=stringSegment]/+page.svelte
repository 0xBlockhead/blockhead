<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.CodexDataset, {
		cid: params.cid,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			filename: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CodexDatasetView from '$/views/CodexDatasetView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.cid ?? '') || 'codex dataset' : (pageSelection.entity.filename ?? '') || pageSelection.entitySelector.cid || 'codex dataset'} • codex dataset • Blockhead</title>
</svelte:head>


<Page>
	<CodexDatasetView
		selection={pageSelection}
	/>
</Page>
