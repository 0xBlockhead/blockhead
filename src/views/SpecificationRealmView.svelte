<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.SpecificationRealm> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const specificationRealm = $derived(viewSelection({
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || (pendingEntity.realm ?? '') || 'Specification realm')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SpecificationProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationRealm}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
			{
				specificationRealmSlug: String(specificationRealmById[String(selection.entitySelector.realm)].slug),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={specificationRealm}>
			{#snippet children(entity)}
				{entity.label || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.realm ?? '') || (pendingEntity.label ?? '') || titleFallback}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A realm gathers related specification families so you browse documents by steward and topic—not by vote totals.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={specificationRealm}
			>
				{#snippet children(entity)}
					{@const labelPlural = entity.labelPlural}
					{#if labelPlural != null}
						<div>
							<dt>Label plural</dt>
							<dd>
								{labelPlural}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Slug</dt>
				<dd>
					<ResourceBoundary
						resource={specificationRealm}
					>
						{#snippet children(entity)}
							{entity.slug}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const specificationRealmSpecificationProposalKindsViewProposalKindsResource = selection.$$proposalKinds}
		<ResourceBoundary
			resource={specificationRealmSpecificationProposalKindsViewProposalKindsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SpecificationProposalKindsView
						selection={specificationRealmSpecificationProposalKindsViewProposalKindsResource}
						countResource={specificationRealmSpecificationProposalKindsViewProposalKindsResource.count}
						title='Proposal kinds'
						href='/proposals'
						id='proposal-kinds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
