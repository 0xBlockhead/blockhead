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
	import { Source } from '$/sources/Source.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Proposal kinds',
		typeAnnotationParagraphs = [],
		placeholderText,
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
	import { EntityLayout } from '$/components/EntityView.svelte'
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
					labelPlural: true,
					label: true,
					category: true,
					realm: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationProposalKind}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(specificationProposalKinds)}
			{@const uniqueSpecificationProposalKinds = [...new Map(specificationProposalKinds.values.map((specificationProposalKind) => [specificationProposalKind[EntityMetaKey.SelectorKey], specificationProposalKind])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationProposalKind}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={specificationProposalKinds.totalCount}
				getKey={(specificationProposalKind) => specificationProposalKind[EntityMetaKey.SelectorKey]}
				items={uniqueSpecificationProposalKinds}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Specification proposal kinds yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: specificationProposalKind }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SpecificationProposalKind> })}
					{@const specificationProposalKindFields = { ...specificationProposalKind[EntityMetaKey.Selector], ...specificationProposalKind }}
					{@const specificationProposalKindHrefFields = { ...specificationProposalKind, ...specificationProposalKind[EntityMetaKey.Selector] }}
					<SpecificationProposalKindView
						selection={select(EntityType.SpecificationProposalKind, specificationProposalKind[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={specificationProposalKindFields}
						href={
							(specificationProposalKindHrefFields.realm !== undefined && specificationProposalKindHrefFields.category !== undefined ? resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
								specificationRealmSlug: String(specificationRealmById[String(specificationProposalKindHrefFields.realm)].slug ?? ''),
								proposalKindSlug: String(proposalCategoryById[String(specificationProposalKindHrefFields.category)].slug ?? ''),
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
		entityType={EntityType.SpecificationProposalKind}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

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
													href={resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
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
									).$$proposals({
										sources: [Source.Constants_Internal],
									})}
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
