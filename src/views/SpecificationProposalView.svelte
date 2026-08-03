<!-- Generated from APP.ts. -->

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

	const viewSelection = $derived(selection({
		sources: selection.sources ?? specificationProposalSources({}),
	}))
	const specificationProposal = $derived(viewSelection({
		fields: {
			documentTitle: true,
			documentStatus: true,
		},
	}))
	const viewDomId = $derived('specification-proposal-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={
		title ?? (([
			[(proposalCategoryById[selection.entitySelector.category]?.label ?? selection.entitySelector.category) + '-', String(selection.entitySelector.number)].filter(Boolean).join(''),
			(prefetched.documentTitle ?? ''),
		]
			.filter(Boolean)
			.join(': ')
			|| [
				(proposalCategoryById[selection.entitySelector.category]?.label ?? selection.entitySelector.category),
				String(selection.entitySelector.number),
			]
				.filter(Boolean)
				.join('-'))
			|| 'Specification proposal')
	}
	href={
		href === undefined ?
			resolve(
				'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]',
				{
					specificationRealmSlug: specificationRealmById[selection.entitySelector.realm].slug,
					proposalKindSlug: proposalCategoryById[selection.entitySelector.category].slug,
					proposalRef: `${proposalCategoryById[selection.entitySelector.category].label}-${selection.entitySelector.number}`,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.SummaryInline}
			{`${proposalCategoryById[selection.entitySelector.category].label ?? selection.entitySelector.category}-${selection.entitySelector.number}`}
		{:else}
			<ResourceBoundary resource={specificationProposal}>
				{#snippet children(entity)}
					{@const proposalIdentifier = `${entity.categoryLabel ?? proposalCategoryById[selection.entitySelector.category].label ?? selection.entitySelector.category}-${selection.entitySelector.number}`}
					{@const documentTitle = (entity.documentTitle ?? '').trim()}
					{@const heading = documentTitle !== '' ? documentTitle : selection.entitySelector.category === 'Ensip' ? ((entity.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1] ?? '').trim() : ''}
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
					{`${entity.categoryLabel ?? proposalCategoryById[selection.entitySelector.category].label ?? selection.entitySelector.category}-${selection.entitySelector.number}`}
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
										specificationRealmSlug: specificationRealmById[selection.entitySelector.realm].slug,
									}
								)
							}
						>
							{specificationRealmById[selection.entitySelector.realm]?.label ?? selection.entitySelector.realm}
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
										specificationRealmSlug: specificationRealmById[selection.entitySelector.realm].slug,
										proposalKindSlug: proposalCategoryById[selection.entitySelector.category].slug,
									}
								)
							}
						>
							{proposalCategoryById[selection.entitySelector.category]?.label ?? selection.entitySelector.category}
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
						<Markdown content={documentBody} />
					{:else}
						<p data-text="muted">No proposal body available.</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
