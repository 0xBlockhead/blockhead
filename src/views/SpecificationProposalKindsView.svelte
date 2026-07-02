<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Proposal kinds',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Specification proposal kinds...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationProposalKinds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SpecificationProposalKind>
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
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}


<ResourceBoundary
	resource={selection({
		limit: 512,
		fields: {
			label: true,
			labelPlural: true,
		},
	})}
	{placeholderText}
>
	{#snippet children(kinds)}
		{#if kinds.values.length === 0}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<CollapsibleTabs
				id={id}
				{open}
				sectionIdPrefix="proposal-kind"
				sections={[
					{ id: 'kinds', label: title },
				]}
				data-card
				scrollContainerProps={{
					'data-scroll-container': 'block',
				}}
			>
				{#snippet Summary()}
					<div data-column="gap-1">
						<header
							data-row-item="flexible"
							data-row="wrap gap-4"
						>
							<Heading>
								{title}
							</Heading>
						</header>

						<div data-row="wrap align-center gap-2">
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Specifications are grouped by steward realm and document family, then numbered drafts from public repositories.
									</p>
								{/snippet}

								<abbr
									class="entity-heading-tip"
									aria-label="How proposals are grouped"
								>i</abbr>
							</Tooltip>
						</div>
					</div>
				{/snippet}

				{#snippet SectionKinds()}
					<div data-column="gap-4 layout-flex">
						{#each kinds.values.toSorted((first, second) => (
							String(first.entitySelector.category).localeCompare(String(second.entitySelector.category))
						)) as kind (String(kind.entitySelector.realm) + ':' + String(kind.entitySelector.category))}
							<section data-scroll-marker-label={String(kind.entitySelector.category)}>
								<SpecificationProposalKindView
									selection={select(
										EntityType.SpecificationProposalKind,
										{
											realm: kind.entitySelector.realm,
											category: kind.entitySelector.category,
										}
									)}
									href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
										specificationRealmSlug: String(specificationRealmById[String(kind.entitySelector.realm)].slug),
										proposalKindSlug: String(proposalCategoryById[String(kind.entitySelector.category)].slug),
									})}
									layout={EntityLayout.Title}
									open={false}
									prefetched={kind}
								/>

								<SpecificationProposalsView
									collapsible={false}
									selection={select(
										EntityType.SpecificationProposalKind,
										{
											realm: kind.entitySelector.realm,
											category: kind.entitySelector.category,
										}
									)[EntityProxyField]<EntityType.SpecificationProposal>('$$proposals')}
									filterCategory={kind.entitySelector.category}
									filterRealm={kind.entitySelector.realm}
									id={`proposal-kind:${String(kind.entitySelector.realm)}:${String(kind.entitySelector.category)}:proposals`}
									open
									title={String(kind.entitySelector.category)}
								/>
							</section>
						{/each}
					</div>
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</ResourceBoundary>
