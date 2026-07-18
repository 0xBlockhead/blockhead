<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.SpecificationProposal>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SpecificationProposal>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const specificationProposal = $derived(selection({
		sources: selection.sources,
		fields: {
			documentTitle: true,
			documentStatus: true,
		},
	}))
	const titleFallback = $derived([[
			[(String((proposalCategoryById[String(pendingEntity.category)]?.label ?? (String((pendingEntity.category) ?? ''))) ?? '') ? String((proposalCategoryById[String(pendingEntity.category)]?.label ?? (String((pendingEntity.category) ?? ''))) ?? '') + '-' : ''), String((pendingEntity.number) ?? '')].filter(Boolean).join(''),
			String((pendingEntity.documentTitle) ?? ''),
		].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
			[String((proposalCategoryById[String(pendingEntity.category)]?.label ?? (String((pendingEntity.category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((pendingEntity.number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal')
	const viewDomId = $derived('specification-proposal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.realm !== undefined && pendingEntity.category !== undefined && pendingEntity.number !== undefined ? resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]/[proposalRef=proposalRef]', {
			specificationRealmSlug: String(specificationRealmById[String(pendingEntity.realm)].slug ?? ''),
			proposalKindSlug: String(proposalCategoryById[String(pendingEntity.category)].slug ?? ''),
			proposalRef: `${String(String(proposalCategoryById[String(pendingEntity.category)].label ?? '') ?? '')}-${String(pendingEntity.number ?? '')}`,
		}) : undefined)
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
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							documentCategory: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentCategory = resolvedEntity.documentCategory}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							documentStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentStatus = resolvedEntity.documentStatus}
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
						<ResourceBoundary
							resource={
								selection({
									sources: selection.sources,
									fields: {
										realm: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const realm = resolvedEntity.realm}
								{#if realm !== undefined && realm !== null}
									<a
										href={
											resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
												specificationRealmSlug: specificationRealmById[String(({ value: realm, ...resolvedEntity }).value)].slug,
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
						<ResourceBoundary
							resource={
								selection({
									sources: selection.sources,
									fields: {
										category: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const category = resolvedEntity.category}
								{#if category !== undefined && category !== null}
									<a
										href={
											resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
												specificationRealmSlug: specificationRealmById[String(({ value: category, ...resolvedEntity }).realm)].slug,
												proposalKindSlug: proposalCategoryById[String(({ value: category, ...resolvedEntity }).category)].slug,
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
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							documentBody: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentBody = resolvedEntity.documentBody}
					{#if documentBody !== undefined && documentBody !== null && documentBody !== ''}
						<Markdown content={String(documentBody)} />
					{:else}
						<p data-text="muted">No proposal body available.</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
