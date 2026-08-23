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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiModel, data.selector, {
		sources: [
			Source.Anthropic_Rest,
			Source.HuggingFaceHub_Rest,
			Source.Mlflow_Rest,
			Source.OpenAI_Rest,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.providerModelId ?? '') || 'AI model' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.providerModelId || 'AI model')} • AI model • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI model'} • AI model • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AiModelView
		selection={pageSelection}
	/>
	{/if}
</Page>
