<!-- Generated from APP.ts. -->

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
	const specificationProposalKind = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	})({
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
		},
	}))
	const titleFallback = $derived((prefetched.labelPlural ?? '') || (proposalCategoryById[selection.entitySelector.category]?.labelPlural ?? selection.entitySelector.category) || 'Specification proposal kind')


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
		href === undefined ?
			resolve(
				'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
				{
					specificationRealmSlug: specificationRealmById[selection.entitySelector.realm].slug,
					proposalKindSlug: proposalCategoryById[selection.entitySelector.category].slug,
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Realm</dt>
				<dd>
					{selection.entitySelector.realm}
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
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const proposalsResource = selection
			.$$proposals({
				sources: specificationProposalSources({
					realm: pendingEntity.realm,
					category: pendingEntity.category,
				}),
			})}
		<ResourceBoundary
			resource={proposalsResource}
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
								selection={proposalsResource}
								countResource={proposalsResource.count}
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
