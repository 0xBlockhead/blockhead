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
		title = 'EIP-8004 reputation feedback observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004ReputationFeedback_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Eip8004ReputationFeedback_Timestamp>
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
	entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
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
				value: true,
				timestampMs: true,
				feedbackIndex: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eip8004ReputationFeedbackTimestamps) => [...new Map(eip8004ReputationFeedbackTimestamps.values.map((eip8004ReputationFeedbackTimestamp) => [eip8004ReputationFeedbackTimestamp[EntityMetaKey.SelectorKey], eip8004ReputationFeedbackTimestamp])).values()]}
	getKey={(eip8004ReputationFeedbackTimestamp) => eip8004ReputationFeedbackTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 reputation feedback observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004ReputationFeedbackTimestamp })}
		{@const eip8004ReputationFeedbackTimestampFields = { ...eip8004ReputationFeedbackTimestamp[EntityMetaKey.Selector], ...eip8004ReputationFeedbackTimestamp }}
		<EntityView
			entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
			entitySelector={eip8004ReputationFeedbackTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eip8004ReputationFeedbackTimestampFields.value) ?? '')].filter(Boolean).join(' ') || [String((eip8004ReputationFeedbackTimestampFields.feedbackIndex) ?? '')].filter(Boolean).join(' ') || 'EIP-8004 reputation feedback timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((eip8004ReputationFeedbackTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eip8004ReputationFeedbackTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
