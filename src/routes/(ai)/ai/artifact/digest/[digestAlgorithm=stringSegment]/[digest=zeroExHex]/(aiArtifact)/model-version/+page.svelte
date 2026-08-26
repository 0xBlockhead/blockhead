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
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiModelVersion, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelVersionView from '$/views/AiModelVersionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'AI model version' : (pageSelection.entity.versionId ?? '') || (pageSelection.entity.revision ?? '') || 'AI model version')} • AI model version • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI model version'} • AI model version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AiModelVersionView
		selection={pageSelection}
	/>
	{/if}
</Page>
