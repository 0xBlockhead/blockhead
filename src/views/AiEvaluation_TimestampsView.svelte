<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AiEvaluation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiEvaluation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				metricName: true,
				value: true,
				unit: true,
				subjectKind: true,
			},
		})
	}
>
	{#snippet Item({ item: aiEvaluationTimestamp })}
		{@const aiEvaluationTimestampSelector = aiEvaluationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiEvaluation_Timestamp}
			entitySelector={aiEvaluationTimestampSelector}
		>
			{#snippet Title()}
				{aiEvaluationTimestampSelector.metricName || 'AI evaluation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(aiEvaluationTimestamp.value ?? ''), (aiEvaluationTimestamp.unit ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiEvaluationTimestampSelector.subjectKind}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
