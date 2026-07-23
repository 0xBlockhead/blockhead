<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiEvaluation_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.AiEvaluation_Timestamp}
			entitySelector={aiEvaluationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiEvaluationTimestampFields.metricName) ?? '')].filter(Boolean).join(' ') || 'AI evaluation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((aiEvaluationTimestampFields.value) ?? ''), String((aiEvaluationTimestampFields.unit) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiEvaluationTimestampFields.subjectKind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
