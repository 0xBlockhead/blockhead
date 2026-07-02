<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'
	import { defaultSpecificationProposalSources } from '$/sources/$sourceSelections.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposalKind>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SpecificationProposalKind>>
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

	const specificationProposalKind = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
			$specificationRealm: true,
			...(open && {
				$$proposals: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(selection.entitySelector.category)]?.labelPlural ?? (String((selection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind')
	const viewDomId = $derived('specification-proposal-kind-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
			specificationRealmSlug: String(specificationRealmById[String(({ ...selection.entitySelector, ...prefetched }).realm)].slug),
			proposalKindSlug: String(proposalCategoryById[String(({ ...selection.entitySelector, ...prefetched }).category)].slug),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).labelPlural) ?? '')].filter(Boolean).join(' ') || title || [String((proposalCategoryById[String(selection.entitySelector.category)]?.labelPlural ?? (String((selection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
		{:else}
			<ResourceBoundary resource={specificationProposalKind}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).labelPlural) ?? '')].filter(Boolean).join(' ') || title || [String((proposalCategoryById[String(selection.entitySelector.category)]?.labelPlural ?? (String((selection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.labelPlural) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).labelPlural) ?? '')].filter(Boolean).join(' ') || title || [String((proposalCategoryById[String(selection.entitySelector.category)]?.labelPlural ?? (String((selection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
		{:else}
			<ResourceBoundary resource={specificationProposalKind}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).labelPlural) ?? '')].filter(Boolean).join(' ') || title || [String((proposalCategoryById[String(selection.entitySelector.category)]?.labelPlural ?? (String((selection.entitySelector.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.label) ?? '')].filter(Boolean).join(' ') || [String((entity.labelPlural) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ResourceBoundary resource={specificationProposalKind}>
				{#snippet children(entity)}
					<SpecificationProposalsView
						selection={
								selection[EntityProxyField]<EntityType.SpecificationProposal>('$$proposals', {
									sources: defaultSpecificationProposalSources,
								})
							}
						title={String(entity.labelPlural ?? 'Proposals')}
						emptyText='No proposals for this kind.'
						filterRealm={selection.entitySelector.realm}
						filterCategory={selection.entitySelector.category}
						id='SpecificationProposalsView-$$proposals'
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
