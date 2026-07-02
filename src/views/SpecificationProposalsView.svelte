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
	import { specificationRealmById, proposalCategoryById } from '$/constants/SpecificationProposal.ts'
	import { defaultSpecificationProposalSources, specificationProposalSourceSelectionByKey } from '$/sources/$sourceSelections.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Proposals',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Specification proposals...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationProposals-list',
		filterRealm,
		filterCategory,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SpecificationProposal>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
			filterRealm?: unknown
			filterCategory?: unknown
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()
	const selectedSources = $derived(specificationProposalSourceSelectionByKey[[String(filterRealm), String(filterCategory)].join(':')] ?? defaultSpecificationProposalSources)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		These proposal cards come from public standards repositories for Bitcoin BIPs, Zcash ZIPs, Filecoin FIPs, Solana SIMDs, CAIPs, ENSIPs, and Ethereum EIPs/ERCs.
	</p>

	<p>
		They document design specs, not live on-chain vote tallies for a particular DAO.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: selectedSources,
				count: true,
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationProposal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(specificationProposals)}
			{@const uniqueSpecificationProposals = [...new Map(specificationProposals.values.filter((specificationProposal) => (filterRealm == null || specificationProposal.entitySelector.realm === filterRealm) && (filterCategory == null || specificationProposal.entitySelector.category === filterCategory)).map((specificationProposal) => [specificationProposal[EntityMetaKey.SelectorKey], specificationProposal])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationProposal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={specificationProposals.values.length === uniqueSpecificationProposals.length && specificationProposals.totalCount != null && specificationProposals.totalCount >= uniqueSpecificationProposals.length ? specificationProposals.totalCount : uniqueSpecificationProposals.length}
				getKey={(specificationProposal) => specificationProposal[EntityMetaKey.SelectorKey]}
				items={uniqueSpecificationProposals}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No specification proposals yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: specificationProposal }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SpecificationProposal> })}
					<SpecificationProposalView
						href={
							resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]', {
								specificationRealmSlug: String(specificationRealmById[String(({ ...specificationProposal.entitySelector, ...specificationProposal }).realm)].slug),
								proposalKindSlug: String(proposalCategoryById[String(({ ...specificationProposal.entitySelector, ...specificationProposal }).category)].slug),
								proposalRef: `${String(String(proposalCategoryById[String(({ ...specificationProposal.entitySelector, ...specificationProposal }).category)].slug))}-${String(({ ...specificationProposal.entitySelector, ...specificationProposal }).number)}`,
							})
						}
						selection={select(EntityType.SpecificationProposal, specificationProposal.entitySelector)}
						prefetched={specificationProposal}
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
		entityType={EntityType.SpecificationProposal}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
