<!-- Generated from APP.ts. -->

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

	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.realm || 'Specification realm')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SpecificationProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationRealm}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
				{
					specificationRealmSlug: specificationRealmById[selection.entitySelector.realm].slug,
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
		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources ?? [
						Source.Constants_Internal,
					],
					fields: {
						label: true,
						labelPlural: true,
						slug: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{entity.label || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.realm || (prefetched.label ?? '') || titleFallback}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A realm gathers related specification families so you browse documents by steward and topic—not by vote totals.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources ?? [
							Source.Constants_Internal,
						],
						fields: {
							label: true,
							labelPlural: true,
							slug: true,
						},
					})
				}
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
						resource={
							selection({
								sources: selection.sources ?? [
									Source.Constants_Internal,
								],
								fields: {
									label: true,
									labelPlural: true,
									slug: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.slug}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const proposalKindsResource = selection.$$proposalKinds}
		<ResourceBoundary
			resource={proposalKindsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SpecificationProposalKindsView
						selection={proposalKindsResource}
						countResource={proposalKindsResource.count}
						title='Proposal kinds'
						href={resolve('/(proposals)/proposals')}
						id='proposal-kinds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
