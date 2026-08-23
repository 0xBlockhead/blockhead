<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/model/[providerModelId=stringSegment]',
			{
				providerId: params.providerId,
				providerModelId: params.providerModelId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.AiModel, data.selector, {
		sources: [
			Source.Anthropic_Rest,
			Source.HuggingFaceHub_Rest,
			Source.Mlflow_Rest,
			Source.OpenAI_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<AiModelView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
