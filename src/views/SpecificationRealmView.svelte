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
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationRealm>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SpecificationRealm>>
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

	const specificationRealm = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
			...(open && {
				$$proposalKinds: true,
				$$proposals: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm')
	const viewDomId = $derived('specification-realm-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import SpecificationProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationRealm}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
			specificationRealmSlug: String(specificationRealmById[String(({ ...selection.entitySelector, ...prefetched }).realm)].slug),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm'}
		{:else}
			<ResourceBoundary resource={specificationRealm}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).realm) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm'}
		{:else}
			<ResourceBoundary resource={specificationRealm}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).realm) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.realm) ?? '')].filter(Boolean).join(' ') || [String((entity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A realm gathers related specification families so you browse documents by steward and topic—not by vote totals.
		</p>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<SpecificationProposalKindsView
				selection={selection[EntityProxyField]<EntityType.SpecificationProposalKind>('$$proposalKinds')}
				title='Proposal kinds'
				href={resolve('/(explore)/(proposals)/proposals')}
				emptyText='No proposal kinds for this realm.'
				id='SpecificationProposalKindsView-$$proposalKinds'
			/>
		{/if}
	{/snippet}
</EntityView>
