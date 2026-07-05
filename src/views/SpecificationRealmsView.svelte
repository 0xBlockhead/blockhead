<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import { EntityProxyField, type EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import SpecificationProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Specification realms',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationRealms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SpecificationRealm>
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
					label: true,
					realm: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(specificationRealms)}
			{@const uniqueSpecificationRealms = [...new Map(specificationRealms.values.map((specificationRealm) => [specificationRealm[EntityMetaKey.SelectorKey], specificationRealm])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationRealm}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={specificationRealms.totalCount}
				getKey={(specificationRealm) => specificationRealm[EntityMetaKey.SelectorKey]}
				items={uniqueSpecificationRealms}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Specification realms yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: specificationRealm }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SpecificationRealm> })}
					{@const specificationRealmFields = { ...specificationRealm[EntityMetaKey.Selector], ...specificationRealm }}
					{@const specificationRealmHrefFields = { ...specificationRealm, ...specificationRealm[EntityMetaKey.Selector] }}
					<SpecificationRealmView
						selection={select(EntityType.SpecificationRealm, specificationRealm[EntityMetaKey.Selector])}
						prefetched={specificationRealmFields}
						href={
							(specificationRealmHrefFields.realm !== undefined ? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
								specificationRealmSlug: String(specificationRealmById[String(specificationRealmHrefFields.realm)].slug ?? ''),
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
		entityType={EntityType.SpecificationRealm}
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
		},
	})}
	{placeholderText}
>
	{#snippet children(realms)}
		{#if realms.values.length === 0}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<CollapsibleTabs
				id={id}
				{open}
				sectionIdPrefix="proposal-realm"
				sections={[
					{ id: 'realms', label: title },
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
										Realms are top-level stewards for specification catalogs. Open a realm for document families, then numbered drafts.
									</p>
								{/snippet}

								<abbr
									class="entity-heading-tip"
									aria-label="How realms are grouped"
								>i</abbr>
							</Tooltip>
						</div>
					</div>
				{/snippet}

				{#snippet SectionRealms()}
					<div data-column="gap-4 layout-flex">
						{#each realms.values.toSorted((first, second) => (
							String(first.entitySelector.realm).localeCompare(String(second.entitySelector.realm))
						)) as realm (String(realm.entitySelector.realm))}
							<section data-scroll-marker-label={String(realm.entitySelector.realm)}>
								<SpecificationRealmView
									selection={select(
										EntityType.SpecificationRealm,
										{ realm: realm.entitySelector.realm }
									)}
									href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
										specificationRealmSlug: String(specificationRealmById[String(realm.entitySelector.realm)].slug),
									})}
									layout={EntityLayout.Title}
									open={false}
									prefetched={realm}
								/>

								<SpecificationProposalKindsView
									collapsible={false}
									selection={select(
										EntityType.SpecificationRealm,
										{ realm: realm.entitySelector.realm }
									)[EntityProxyField]<EntityType.SpecificationProposalKind>('$$proposalKinds')({
										sources: [Source.Constants_Internal],
									})}
									id={`proposal-realm:${String(realm.entitySelector.realm)}:proposal-kinds`}
									open
									title={String(realm.entitySelector.realm)}
								/>
							</section>
						{/each}
					</div>
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</ResourceBoundary>
