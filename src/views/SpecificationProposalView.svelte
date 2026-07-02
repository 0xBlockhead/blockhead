<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { defaultSpecificationProposalSources, specificationProposalSourceSelectionByKey } from '$/sources/$sourceSelections.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposal>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SpecificationProposal>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const selectedViewSources = $derived(specificationProposalSourceSelectionByKey[[String(selection.entitySelector.realm), String(selection.entitySelector.category)].join(':')] ?? defaultSpecificationProposalSources)

	const specificationProposal = $derived(selection({
		sources: selectedViewSources,
		fields: {
			documentTitle: true,
			documentStatus: true,
			...(open && {
				realmLabel: true,
				categoryLabel: true,
				categoryLabelPlural: true,
				documentCategory: true,
				documentBody: true,
			}),
		},
	}))
	const titleFallback = $derived([[
			[String((proposalCategoryById[String(({ ...selection.entitySelector, ...prefetched }).category)]?.label ?? (String((({ ...selection.entitySelector, ...prefetched }).category) ?? ''))) ?? '') + '-', String((({ ...selection.entitySelector, ...prefetched }).number) ?? '')].filter(Boolean).join(''),
			String((({ ...selection.entitySelector, ...prefetched }).documentTitle) ?? ''),
		].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
			[String((proposalCategoryById[String(selection.entitySelector.category)]?.label ?? (String((selection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((selection.entitySelector.number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal')
	const viewDomId = $derived('specification-proposal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]', {
			specificationRealmSlug: String(specificationRealmById[String(({ ...selection.entitySelector, ...prefetched }).realm)].slug),
			proposalKindSlug: String(proposalCategoryById[String(({ ...selection.entitySelector, ...prefetched }).category)].slug),
			proposalRef: `${String(String(proposalCategoryById[String(({ ...selection.entitySelector, ...prefetched }).category)].slug))}-${String(({ ...selection.entitySelector, ...prefetched }).number)}`,
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.SummaryInline}
			{`${String(proposalCategoryById[String(selection.entitySelector.category)].label ?? selection.entitySelector.category ?? '')}-${String(selection.entitySelector.number ?? '')}`}
		{:else}
			<ResourceBoundary resource={specificationProposal}>
				{#snippet children(entity)}
					{@const proposalIdentifier = `${String(entity.categoryLabel ?? proposalCategoryById[String(selection.entitySelector.category)].label ?? selection.entitySelector.category ?? '')}-${String(selection.entitySelector.number ?? '')}`}
					{@const documentTitle = String(entity.documentTitle ?? '').trim()}
					{@const documentBodyHeading = String(selection.entitySelector.category) === 'Ensip' ? (String(entity.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1] ?? '').trim() : ''}
					{@const heading = documentTitle !== '' ? documentTitle : documentBodyHeading}
					{#if heading === ''}
						{proposalIdentifier}
					{:else if heading.toLowerCase().startsWith(`${proposalIdentifier.toLowerCase()}:`)}
						{heading}
					{:else}
						{`${proposalIdentifier}: ${heading}`}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={specificationProposal}>
			{#snippet children(entity)}
				<span>
					{`${String(entity.categoryLabel ?? proposalCategoryById[String(selection.entitySelector.category)].label ?? selection.entitySelector.category ?? '')}-${String(selection.entitySelector.number ?? '')}`}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each entry is a numbered specification pulled from upstream documentation trees, grouped first by stewarding realm, then by document family.
		</p>

		<p>
			Catalog entries capture stewarded specification text and lifecycle status; live vote weights and treasury execution are tracked in governance systems on-chain or in forums.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={specificationProposal}>
				{#snippet Pending()}
					{@const documentCategory = prefetched.documentCategory ?? selection.entitySelector.documentCategory}
					{#if documentCategory !== undefined && documentCategory !== null}
						<div>
							<dt>Category</dt>
							<dd>
								{String((documentCategory) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const documentCategory = entity.documentCategory ?? selection.entitySelector.documentCategory ?? prefetched.documentCategory}
					{#if documentCategory !== undefined && documentCategory !== null}
						<div>
							<dt>Category</dt>
							<dd>
								{String((documentCategory) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={specificationProposal}>
				{#snippet Pending()}
					{@const documentStatus = prefetched.documentStatus ?? selection.entitySelector.documentStatus}
					{#if documentStatus !== undefined && documentStatus !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((documentStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const documentStatus = entity.documentStatus ?? selection.entitySelector.documentStatus ?? prefetched.documentStatus}
					{#if documentStatus !== undefined && documentStatus !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((documentStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<dt>Realm</dt>
					<dd>
						<ResourceBoundary resource={specificationProposal}>
							{#snippet Pending()}
								{@const realm = prefetched.realm ?? selection.entitySelector.realm}
								{#if realm !== undefined && realm !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: realm, ...selection.entitySelector, ...prefetched }).value)].slug),
											})
										}
									>
										{String((specificationRealmById[String(realm)]?.label ?? (String((realm) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const realm = entity.realm ?? selection.entitySelector.realm ?? prefetched.realm}
								{#if realm !== undefined && realm !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: realm, ...selection.entitySelector, ...prefetched, ...entity }).value)].slug),
											})
										}
									>
										{String((specificationRealmById[String(realm)]?.label ?? (String((realm) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<ResourceBoundary resource={specificationProposal}>
							{#snippet Pending()}
								{@const category = prefetched.category ?? selection.entitySelector.category}
								{#if category !== undefined && category !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: category, ...selection.entitySelector, ...prefetched }).realm)].slug),
												proposalKindSlug: String(proposalCategoryById[String(({ value: category, ...selection.entitySelector, ...prefetched }).category)].slug),
											})
										}
									>
										{String((proposalCategoryById[String(category)]?.label ?? (String((category) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const category = entity.category ?? selection.entitySelector.category ?? prefetched.category}
								{#if category !== undefined && category !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: category, ...selection.entitySelector, ...prefetched, ...entity }).realm)].slug),
												proposalKindSlug: String(proposalCategoryById[String(({ value: category, ...selection.entitySelector, ...prefetched, ...entity }).category)].slug),
											})
										}
									>
										{String((proposalCategoryById[String(category)]?.label ?? (String((category) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>

		<section
			id={viewDomId + '-body'}
			data-scroll-marker-label='Document body'
		>
			<h3>Document body</h3>
			<ResourceBoundary resource={specificationProposal}>
				{#snippet children(entity)}
					{@const documentBody = entity.documentBody ?? selection.entitySelector.documentBody ?? prefetched.documentBody}
					{#if documentBody === undefined || documentBody === null || documentBody === ''}
						<p data-text="muted">No proposal body available.</p>
					{:else}
						<Markdown content={String(documentBody)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
