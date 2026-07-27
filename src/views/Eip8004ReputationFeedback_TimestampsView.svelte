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
	}: EntityListViewProps<EntityType.Eip8004ReputationFeedback_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				value: true,
				timestampMs: true,
				feedbackIndex: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: eip8004ReputationFeedbackTimestamp })}
		{@const eip8004ReputationFeedbackTimestampSelector = eip8004ReputationFeedbackTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
			entitySelector={eip8004ReputationFeedbackTimestampSelector}
		>
			{#snippet Title()}
				{(eip8004ReputationFeedbackTimestamp.value ?? '') || String(eip8004ReputationFeedbackTimestampSelector.feedbackIndex) || 'EIP-8004 reputation feedback timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(eip8004ReputationFeedbackTimestampSelector.timestampMs)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004ReputationFeedbackTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
