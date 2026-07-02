<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'Lifecycle snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos governance proposal observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosGovernanceProposal_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosGovernanceProposal_Timestamp>
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
	import CosmosGovernanceProposal_TimestampView from '$/views/CosmosGovernanceProposal_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					status: true,
					source: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosGovernanceProposal_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosGovernanceProposalTimestamps)}
			{@const uniqueCosmosGovernanceProposalTimestamps = [...new Map(cosmosGovernanceProposalTimestamps.values.map((cosmosGovernanceProposalTimestamp) => [cosmosGovernanceProposalTimestamp[EntityMetaKey.SelectorKey], cosmosGovernanceProposalTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosGovernanceProposal_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosGovernanceProposalTimestamps.values.length === uniqueCosmosGovernanceProposalTimestamps.length && cosmosGovernanceProposalTimestamps.totalCount != null && cosmosGovernanceProposalTimestamps.totalCount >= uniqueCosmosGovernanceProposalTimestamps.length ? cosmosGovernanceProposalTimestamps.totalCount : uniqueCosmosGovernanceProposalTimestamps.length}
				getKey={(cosmosGovernanceProposalTimestamp) => cosmosGovernanceProposalTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosGovernanceProposalTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos governance proposal observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosGovernanceProposalTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosGovernanceProposal_Timestamp> })}
					<CosmosGovernanceProposal_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...cosmosGovernanceProposalTimestamp.entitySelector, ...cosmosGovernanceProposalTimestamp }).$proposal.$network.caip2.namespace)}:${String(({ ...cosmosGovernanceProposalTimestamp.entitySelector, ...cosmosGovernanceProposalTimestamp }).$proposal.$network.caip2.reference)}`,
								proposalId: String(({ ...cosmosGovernanceProposalTimestamp.entitySelector, ...cosmosGovernanceProposalTimestamp }).$proposal.proposalId),
								timestampMs: String(({ ...cosmosGovernanceProposalTimestamp.entitySelector, ...cosmosGovernanceProposalTimestamp }).timestampMs),
								source: String(({ ...cosmosGovernanceProposalTimestamp.entitySelector, ...cosmosGovernanceProposalTimestamp }).source),
							})
						}
						selection={select(EntityType.CosmosGovernanceProposal_Timestamp, cosmosGovernanceProposalTimestamp.entitySelector)}
						prefetched={cosmosGovernanceProposalTimestamp}
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
		entityType={EntityType.CosmosGovernanceProposal_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
