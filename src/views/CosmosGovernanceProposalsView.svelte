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
		placeholderText,
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
			selection({
				fields: {
					title: true,
					proposalId: true,
					$network: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={cosmosGovernanceProposals.totalCount}
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
					{@const cosmosGovernanceProposalFields = { ...cosmosGovernanceProposal[EntityMetaKey.Selector], ...cosmosGovernanceProposal }}
					{@const cosmosGovernanceProposalHrefFields = { ...cosmosGovernanceProposal, ...cosmosGovernanceProposal[EntityMetaKey.Selector] }}
					<CosmosGovernanceProposalView
						selection={select(EntityType.CosmosGovernanceProposal, cosmosGovernanceProposal[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cosmosGovernanceProposalFields}
						href={
							(cosmosGovernanceProposalHrefFields.$network !== undefined && cosmosGovernanceProposalHrefFields.$network.caip2 !== undefined && cosmosGovernanceProposalHrefFields.$network.caip2.namespace !== undefined && cosmosGovernanceProposalHrefFields.$network !== undefined && cosmosGovernanceProposalHrefFields.$network.caip2 !== undefined && cosmosGovernanceProposalHrefFields.$network.caip2.reference !== undefined && cosmosGovernanceProposalHrefFields.proposalId !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]', {
								caip2: `${String(cosmosGovernanceProposalHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosGovernanceProposalHrefFields.$network.caip2.reference ?? '')}`,
								proposalId: String(cosmosGovernanceProposalHrefFields.proposalId ?? ''),
							}) : undefined)
						}
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
