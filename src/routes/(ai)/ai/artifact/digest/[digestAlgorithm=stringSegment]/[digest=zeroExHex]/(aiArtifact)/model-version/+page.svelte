<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelVersionView from '$/views/AiModelVersionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiModelVersion, {
					$artifact: data.selector,
				}, {
					sources: [
						Source.HuggingFaceHub_Rest,
						Source.Mlflow_Rest,
					],
					fields: {
						versionId: true,
						revision: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'AI model version' : (pageSelection.entity.versionId ?? '') || (pageSelection.entity.revision ?? '') || 'AI model version')} • AI model version • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'AI model version'} • AI model version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AiModelVersion, {
					$artifact: data.selector,
				}, {
					sources: [
						Source.HuggingFaceHub_Rest,
						Source.Mlflow_Rest,
					],
					fields: {
						versionId: true,
						revision: true,
					},
				}))}

		<AiModelVersionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
