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


	// Components
	import Page from '$/components/Page.svelte'
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiProviderApiOperation, data.selector, {
				sources: [
					Source.Anthropic_Rest,
					Source.OpenAI_Rest,
				],
				fields: {
					label: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.operationId ?? '') || 'AI provider API operation' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.operationId || 'AI provider API operation')} • AI provider API operation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI provider API operation'} • AI provider API operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiProviderApiOperation, data.selector, {
				sources: [
					Source.Anthropic_Rest,
					Source.OpenAI_Rest,
				],
				fields: {
					label: true,
				},
			})}

	<AiProviderApiOperationView
		selection={pageSelection}
	/>
	{/if}
</Page>
