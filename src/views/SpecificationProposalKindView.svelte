<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import specificationProposalSources from '$/sources/specificationProposalSources.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.SpecificationProposalKind> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const specificationProposalKind = $derived(viewSelection({
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.labelPlural ?? '') || (proposalCategoryById[String(pendingEntity.category)]?.labelPlural ?? ((pendingEntity.category ?? ''))) || 'Specification proposal kind')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
			{
				specificationRealmSlug: String(specificationRealmById[String(selection.entitySelector.realm)].slug),
				proposalKindSlug: String(proposalCategoryById[String(selection.entitySelector.category)].slug),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={specificationProposalKind}>
			{#snippet children(entity)}
				{entity.labelPlural || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={specificationProposalKind}>
			{#snippet children(entity)}
				{entity.label || entity.labelPlural || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Realm</dt>
				<dd>
					{pendingEntity.realm}
				</dd>
			</div>

			<div>
				<dt>Slug</dt>
				<dd>
					<ResourceBoundary
						resource={specificationProposalKind}
					>
						{#snippet children(entity)}
							{entity.slug}
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
							<SpecificationRealmView
								selection={select(EntityType.SpecificationRealm, specificationRealm[EntityMetaKey.Selector])}
								prefetched={specificationRealm}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const specificationProposalKindSpecificationProposalsViewProposalsResource = selection
		.$$proposals({
			sources: specificationProposalSources({
				realm: pendingEntity.realm,
				category: pendingEntity.category,
			}),
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
							<SpecificationProposalsView
								selection={specificationProposalKindSpecificationProposalsViewProposalsResource}
								countResource={specificationProposalKindSpecificationProposalsViewProposalsResource.count}
								title={String(entity.labelPlural ?? 'Proposals')}
								filterRealm={selection.entitySelector.realm}
								filterCategory={selection.entitySelector.category}
								id='proposals'
							/>
						{/snippet}
					</ResourceBoundary>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
