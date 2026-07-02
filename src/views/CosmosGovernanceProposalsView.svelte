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
		title = 'Governance proposals',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Cosmos governance proposals...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosGovernanceProposals-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosGovernanceProposal>
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
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
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
					title: true,
					proposalId: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosGovernanceProposal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(cosmosGovernanceProposals)}
			{@const uniqueCosmosGovernanceProposals = [...new Map(cosmosGovernanceProposals.values.map((cosmosGovernanceProposal) => [cosmosGovernanceProposal[EntityMetaKey.SelectorKey], cosmosGovernanceProposal])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosGovernanceProposal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosGovernanceProposals.values.length === uniqueCosmosGovernanceProposals.length && cosmosGovernanceProposals.totalCount != null && cosmosGovernanceProposals.totalCount >= uniqueCosmosGovernanceProposals.length ? cosmosGovernanceProposals.totalCount : uniqueCosmosGovernanceProposals.length}
				getKey={(cosmosGovernanceProposal) => cosmosGovernanceProposal[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosGovernanceProposals}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos governance proposals yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosGovernanceProposal }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosGovernanceProposal> })}
					<CosmosGovernanceProposalView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]', {
								caip2: `${String(({ ...cosmosGovernanceProposal.entitySelector, ...cosmosGovernanceProposal }).$network.caip2.namespace)}:${String(({ ...cosmosGovernanceProposal.entitySelector, ...cosmosGovernanceProposal }).$network.caip2.reference)}`,
								proposalId: String(({ ...cosmosGovernanceProposal.entitySelector, ...cosmosGovernanceProposal }).proposalId),
							})
						}
						selection={select(EntityType.CosmosGovernanceProposal, cosmosGovernanceProposal.entitySelector)}
						prefetched={cosmosGovernanceProposal}
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
		entityType={EntityType.CosmosGovernanceProposal}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
