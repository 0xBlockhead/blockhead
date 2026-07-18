<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'AI evaluation observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiEvaluation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AiEvaluation_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AiEvaluation_TimestampView from '$/views/AiEvaluation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiEvaluation_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				metricName: true,
				value: true,
				unit: true,
				subjectKind: true,
			},
		})
	}
	getResourceItems={(aiEvaluationTimestamps) => [...new Map(aiEvaluationTimestamps.values.map((aiEvaluationTimestamp) => [aiEvaluationTimestamp[EntityMetaKey.SelectorKey], aiEvaluationTimestamp])).values()]}
	getKey={(aiEvaluationTimestamp) => aiEvaluationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI evaluation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiEvaluationTimestamp })}
		{@const aiEvaluationTimestampFields = { ...aiEvaluationTimestamp[EntityMetaKey.Selector], ...aiEvaluationTimestamp }}
		{@const selection = select(EntityType.AiEvaluation_Timestamp, aiEvaluationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AiEvaluation_TimestampView
			selection={selection}
			prefetched={aiEvaluationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
