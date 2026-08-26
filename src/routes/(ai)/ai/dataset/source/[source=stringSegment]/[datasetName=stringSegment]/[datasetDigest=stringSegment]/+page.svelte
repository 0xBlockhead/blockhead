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
		source: params.source,
		datasetName: params.datasetName,
		datasetDigest: params.datasetDigest,
	}, {
		sources: [params.source],
		fields: {
			label: true,
			datasetUri: true,
			huggingFaceDatasetId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.datasetName ?? '') || 'AI dataset' : (pageSelection.entity.label ?? '') || [(pageSelection.entity.datasetUri ?? ''), (pageSelection.entitySelector.datasetName ?? ''), (pageSelection.entity.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset'} • AI dataset • Blockhead</title>
</svelte:head>


<Page>
	<AiDatasetView
		selection={pageSelection}
	/>
</Page>
