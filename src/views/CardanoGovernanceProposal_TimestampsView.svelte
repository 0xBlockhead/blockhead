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
		title = 'Cardano governance proposal observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoGovernanceProposal_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoGovernanceProposal_Timestamp>
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
	entityType={EntityType.CardanoGovernanceProposal_Timestamp}
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
				epoch: true,
				status: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoGovernanceProposalTimestamps) => [...new Map(cardanoGovernanceProposalTimestamps.values.map((cardanoGovernanceProposalTimestamp) => [cardanoGovernanceProposalTimestamp[EntityMetaKey.SelectorKey], cardanoGovernanceProposalTimestamp])).values()]}
	getKey={(cardanoGovernanceProposalTimestamp) => cardanoGovernanceProposalTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano governance proposal observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoGovernanceProposalTimestamp })}
		{@const cardanoGovernanceProposalTimestampFields = { ...cardanoGovernanceProposalTimestamp[EntityMetaKey.Selector], ...cardanoGovernanceProposalTimestamp }}
		<EntityView
			entityType={EntityType.CardanoGovernanceProposal_Timestamp}
			entitySelector={cardanoGovernanceProposalTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((cardanoGovernanceProposalTimestampFields.epoch) ?? '') ? 'Epoch ' + String((cardanoGovernanceProposalTimestampFields.epoch) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano governance proposal timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoGovernanceProposalTimestampFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cardanoGovernanceProposalTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
