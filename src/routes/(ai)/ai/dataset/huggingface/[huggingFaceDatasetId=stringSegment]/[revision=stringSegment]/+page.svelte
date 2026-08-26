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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiDataset, {
		huggingFaceDatasetId: params.huggingFaceDatasetId,
		revision: params.revision,
	}, {
		fields: {
			label: true,
			datasetUri: true,
			datasetName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.huggingFaceDatasetId ?? '') || 'AI dataset' : (pageSelection.entity.label ?? '') || [(pageSelection.entity.datasetUri ?? ''), (pageSelection.entity.datasetName ?? ''), (pageSelection.entitySelector.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset'} • AI dataset • Blockhead</title>
</svelte:head>


<Page>
	<AiDatasetView
		selection={pageSelection}
	/>
</Page>
