<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiDataset, {
		datasetUri: decodeURIComponent(params.datasetUri),
	}, {
		fields: {
			label: true,
			datasetName: true,
			huggingFaceDatasetId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.datasetUri ?? '') || 'AI dataset' : (pageSelection.entity.label ?? '') || [(pageSelection.entitySelector.datasetUri ?? ''), (pageSelection.entity.datasetName ?? ''), (pageSelection.entity.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset'} • AI dataset • Blockhead</title>
</svelte:head>


<Page>
	<AiDatasetView
		selection={pageSelection}
	/>
</Page>
