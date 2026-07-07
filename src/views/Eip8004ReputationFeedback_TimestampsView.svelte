<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EIP-8004 reputation feedback observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004ReputationFeedback_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Eip8004ReputationFeedback_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Eip8004ReputationFeedback_TimestampView from '$/views/Eip8004ReputationFeedback_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
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
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(eip8004ReputationFeedbackTimestamps)}
			{@const uniqueEip8004ReputationFeedbackTimestamps = [...new Map(eip8004ReputationFeedbackTimestamps.values.map((eip8004ReputationFeedbackTimestamp) => [eip8004ReputationFeedbackTimestamp[EntityMetaKey.SelectorKey], eip8004ReputationFeedbackTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eip8004ReputationFeedbackTimestamps.totalCount}
				getKey={(eip8004ReputationFeedbackTimestamp) => eip8004ReputationFeedbackTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEip8004ReputationFeedbackTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EIP-8004 reputation feedback observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eip8004ReputationFeedbackTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Eip8004ReputationFeedback_Timestamp> })}
					{@const eip8004ReputationFeedbackTimestampFields = { ...eip8004ReputationFeedbackTimestamp[EntityMetaKey.Selector], ...eip8004ReputationFeedbackTimestamp }}
					<Eip8004ReputationFeedback_TimestampView
						selection={select(EntityType.Eip8004ReputationFeedback_Timestamp, eip8004ReputationFeedbackTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={eip8004ReputationFeedbackTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
