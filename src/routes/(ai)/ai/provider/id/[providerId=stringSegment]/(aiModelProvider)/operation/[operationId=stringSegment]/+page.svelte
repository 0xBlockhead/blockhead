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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiProviderApiOperation, data.selector, {
		sources: [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.operationId ?? '') || 'AI provider API operation' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.operationId || 'AI provider API operation')} • AI provider API operation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI provider API operation'} • AI provider API operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AiProviderApiOperationView
		selection={pageSelection}
	/>
	{/if}
</Page>
