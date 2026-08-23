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
	import AiProviderCatalogEntryView from '$/views/AiProviderCatalogEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiProviderCatalogEntry, data.selector, {
				sources: [
					Source.Anthropic_Rest,
					Source.OpenAI_Rest,
				],
				fields: {
					entryLabel: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.providerEntryId ?? '') || 'AI provider catalog entry' : (pageSelection.entity.entryLabel ?? '') || pageSelection.entitySelector.providerEntryId || 'AI provider catalog entry')} • AI provider catalog entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AI provider catalog entry'} • AI provider catalog entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AiProviderCatalogEntry, data.selector, {
				sources: [
					Source.Anthropic_Rest,
					Source.OpenAI_Rest,
				],
				fields: {
					entryLabel: true,
				},
			})}

	<AiProviderCatalogEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
