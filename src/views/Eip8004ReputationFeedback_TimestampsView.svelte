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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Eip8004ReputationFeedback_Timestamp>
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
	import Eip8004ReputationFeedback_TimestampView from '$/views/Eip8004ReputationFeedback_TimestampView.svelte'
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
		{@const selection = select(EntityType.Eip8004ReputationFeedback_Timestamp, eip8004ReputationFeedbackTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<Eip8004ReputationFeedback_TimestampView
			selection={selection}
			prefetched={eip8004ReputationFeedbackTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
