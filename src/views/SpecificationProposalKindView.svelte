<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { defaultSpecificationProposalSources, specificationProposalSourceSelectionByKey } from '$/sources/$sourceSelections.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: RegisteredEntityProxyResource<EntityType.SpecificationProposalKind>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.SpecificationProposalKind>
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
	const specificationProposalKind = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			labelPlural: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(pendingEntity.category)]?.labelPlural ?? (String((pendingEntity.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind')
	const viewDomId = $derived('specification-proposal-kind-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'realm' in selection.entitySelector
			&& selection.entitySelector.realm != null
			&& selection.entitySelector != null && 'category' in selection.entitySelector
			&& selection.entitySelector.category != null ?
				resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
			specificationRealmSlug: String(specificationRealmById[String(selection.entitySelector.realm)].slug ?? ''),
			proposalKindSlug: String(proposalCategoryById[String(selection.entitySelector.category)].slug ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'labelPlural') && Object.hasOwn(prefetched, 'label')}
			{[String((pendingEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={specificationProposalKind}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'labelPlural') && Object.hasOwn(prefetched, 'label')}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={specificationProposalKind}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
								{String((realm) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slug</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									slug: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slug = resolvedEntity.slug}
							{#if slug !== undefined && slug !== null}
								{String((slug) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Specification realm</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$specificationRealm}
					>
						{#snippet children(specificationRealm)}
							{#if specificationRealm != null && specificationRealm[EntityMetaKey.Selector] != null}
								<SpecificationRealmView
									selection={select(EntityType.SpecificationRealm, specificationRealm[EntityMetaKey.Selector])}
									prefetched={specificationRealm}
									href={
										(
											specificationRealm[EntityMetaKey.Selector] != null && 'realm' in specificationRealm[EntityMetaKey.Selector]
											&& specificationRealm[EntityMetaKey.Selector].realm != null ?
												resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
											specificationRealmSlug: String(specificationRealmById[String(specificationRealm[EntityMetaKey.Selector].realm)].slug ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const specificationProposalKindSpecificationProposalsViewProposalsResource = selection
		.$$proposals({
			sources: specificationProposalSourceSelectionByKey[[String(pendingEntity.realm), String(pendingEntity.category)].join(':')] ?? defaultSpecificationProposalSources,
		})}
				<ResourceBoundary
					resource={specificationProposalKindSpecificationProposalsViewProposalsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<ResourceBoundary
							resource={
									selection({
										fields: {
											labelPlural: true,
										},
									})
								}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								<SpecificationProposalsView
									selection={specificationProposalKindSpecificationProposalsViewProposalsResource}
									countResource={specificationProposalKindSpecificationProposalsViewProposalsResource.count}
									title={String(entity.labelPlural ?? 'Proposals')}
									filterRealm={selection.entitySelector.realm}
									filterCategory={selection.entitySelector.category}
									id='SpecificationProposalsView-proposals'
								/>
							{/snippet}
						</ResourceBoundary>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
