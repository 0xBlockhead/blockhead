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
		title = 'Cardano governance proposal observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoGovernanceProposal_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CardanoGovernanceProposal_Timestamp>
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
	import CardanoGovernanceProposal_TimestampView from '$/views/CardanoGovernanceProposal_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoGovernanceProposal_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cardanoGovernanceProposalTimestamps)}
			{@const uniqueCardanoGovernanceProposalTimestamps = [...new Map(cardanoGovernanceProposalTimestamps.values.map((cardanoGovernanceProposalTimestamp) => [cardanoGovernanceProposalTimestamp[EntityMetaKey.SelectorKey], cardanoGovernanceProposalTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoGovernanceProposal_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cardanoGovernanceProposalTimestamps.totalCount}
				getKey={(cardanoGovernanceProposalTimestamp) => cardanoGovernanceProposalTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCardanoGovernanceProposalTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cardano governance proposal observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cardanoGovernanceProposalTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CardanoGovernanceProposal_Timestamp> })}
					{@const cardanoGovernanceProposalTimestampFields = { ...cardanoGovernanceProposalTimestamp[EntityMetaKey.Selector], ...cardanoGovernanceProposalTimestamp }}
					<CardanoGovernanceProposal_TimestampView
						selection={select(EntityType.CardanoGovernanceProposal_Timestamp, cardanoGovernanceProposalTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cardanoGovernanceProposalTimestampFields}
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
		entityType={EntityType.CardanoGovernanceProposal_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
