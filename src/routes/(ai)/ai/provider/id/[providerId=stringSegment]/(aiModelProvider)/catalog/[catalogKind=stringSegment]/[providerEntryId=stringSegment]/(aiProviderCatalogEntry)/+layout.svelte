<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/catalog/[catalogKind=stringSegment]/[providerEntryId=stringSegment]',
			{
				providerId: params.providerId,
				catalogKind: params.catalogKind,
				providerEntryId: params.providerEntryId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiProviderCatalogEntry, data.selector, {
		sources: [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AiProviderCatalogEntryView from '$/views/AiProviderCatalogEntryView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<AiProviderCatalogEntryView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
