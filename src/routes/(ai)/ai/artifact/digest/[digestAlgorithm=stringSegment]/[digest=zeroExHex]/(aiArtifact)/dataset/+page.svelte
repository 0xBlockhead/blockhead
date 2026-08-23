<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiDataset, {
					$artifact: data.selector,
				}, {
					fields: {
						label: true,
						datasetUri: true,
						datasetName: true,
						huggingFaceDatasetId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'AI dataset' : (pageSelection.entity.label ?? '') || [(pageSelection.entity.datasetUri ?? ''), (pageSelection.entity.datasetName ?? ''), (pageSelection.entity.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset')} • AI dataset • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'AI dataset'} • AI dataset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiDataset, {
					$artifact: data.selector,
				}, {
					fields: {
						label: true,
						datasetUri: true,
						datasetName: true,
						huggingFaceDatasetId: true,
					},
				}))}

		<AiDatasetView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
