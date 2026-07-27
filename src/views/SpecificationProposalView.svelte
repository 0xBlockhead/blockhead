<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.SpecificationProposal> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? specificationProposalSources({}),
	}))
	const specificationProposal = $derived(viewSelection({
		fields: {
			documentTitle: true,
			documentStatus: true,
		},
	}))
	const titleFallback = $derived(([
			[((proposalCategoryById[String(pendingEntity.category)]?.label ?? ((pendingEntity.category ?? ''))) ? (proposalCategoryById[String(pendingEntity.category)]?.label ?? ((pendingEntity.category ?? ''))) + '-' : ''), String(pendingEntity.number ?? '')].filter(Boolean).join(''),
			(pendingEntity.documentTitle ?? ''),
		].filter(Boolean).join(': ')) || [
			(proposalCategoryById[String(pendingEntity.category)]?.label ?? ((pendingEntity.category ?? ''))),
			String(pendingEntity.number ?? ''),
		].filter(Boolean).join('-') || 'Specification proposal')
	const viewDomId = $derived('specification-proposal-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]',
			{
				specificationRealmSlug: String(specificationRealmById[String(selection.entitySelector.realm)].slug),
				proposalKindSlug: String(proposalCategoryById[String(selection.entitySelector.category)].slug),
				proposalRef: `${proposalCategoryById[String(selection.entitySelector.category)].label}-${selection.entitySelector.number}`,
			}
		)
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
					{@const heading = documentTitle !== '' ? documentTitle : String(selection.entitySelector.category) === 'Ensip' ? (String(entity.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1] ?? '').trim() : ''}
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
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							documentCategory: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const documentCategory = entity.documentCategory}
					{#if documentCategory != null}
						<div>
							<dt>Category</dt>
							<dd>
								{documentCategory}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={specificationProposal}
			>
				{#snippet children(entity)}
					{@const documentStatus = entity.documentStatus}
					{#if documentStatus != null}
						<div>
							<dt>Status</dt>
							<dd>
								{documentStatus}
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
						<a
							href={
								resolve(
									'/proposals/[specificationRealmSlug=specificationRealmSlug]',
									{
										specificationRealmSlug: String(specificationRealmById[String(pendingEntity.realm)].slug ?? ''),
									}
								)
							}
						>
							{String((specificationRealmById[String(pendingEntity.realm)]?.label ?? (pendingEntity.realm)) ?? '')}
						</a>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<a
							href={
								resolve(
									'/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]',
									{
										specificationRealmSlug: String(specificationRealmById[String(pendingEntity.realm)].slug ?? ''),
										proposalKindSlug: String(proposalCategoryById[String(pendingEntity.category)].slug ?? ''),
									}
								)
							}
						>
							{String((proposalCategoryById[String(pendingEntity.category)]?.label ?? (pendingEntity.category)) ?? '')}
						</a>
					</dd>
				</div>
			{/if}
		</dl>

		<section
			id={viewDomId + '-body'}
			data-scroll-marker-label='Document body'
		>
			<h3>Document body</h3>
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							documentBody: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const documentBody = entity.documentBody}
					{#if documentBody != null && documentBody !== ''}
						<Markdown content={String(documentBody)} />
					{:else}
						<p data-text="muted">No proposal body available.</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
