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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AiDataset, {
		$artifact: data.selector,
	}, {
		fields: {
			label: true,
			datasetUri: true,
			datasetName: true,
			huggingFaceDatasetId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'AI dataset' : (pageSelection.entity.label ?? '') || [(pageSelection.entity.datasetUri ?? ''), (pageSelection.entity.datasetName ?? ''), (pageSelection.entity.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset')} • AI dataset • Blockhead</title>
</svelte:head>


<Page>
	<AiDatasetView
		selection={pageSelection}
	/>
</Page>
