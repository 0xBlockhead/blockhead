<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmById, proposalCategoryById } from '$/constants/SpecificationProposal.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Proposal kinds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationProposalKinds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SpecificationProposalKind>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationProposalKind}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				labelPlural: true,
				label: true,
				category: true,
				realm: true,
			},
		})
	}
	{countResource}
	getResourceItems={(specificationProposalKinds) => [...new Map(specificationProposalKinds.values.map((specificationProposalKind) => [specificationProposalKind[EntityMetaKey.SelectorKey], specificationProposalKind])).values()]}
	getKey={(specificationProposalKind) => specificationProposalKind[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Specification proposal kinds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: specificationProposalKind })}
		{@const specificationProposalKindFields = { ...specificationProposalKind[EntityMetaKey.Selector], ...specificationProposalKind }}
		<EntityView
			entityType={EntityType.SpecificationProposalKind}
			entitySelector={specificationProposalKind[EntityMetaKey.Selector]}
			href={
				(
					specificationProposalKind[EntityMetaKey.Selector] != null && 'realm' in specificationProposalKind[EntityMetaKey.Selector]
					&& specificationProposalKind[EntityMetaKey.Selector].realm != null
					&& specificationProposalKind[EntityMetaKey.Selector] != null && 'category' in specificationProposalKind[EntityMetaKey.Selector]
					&& specificationProposalKind[EntityMetaKey.Selector].category != null ?
						resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
					specificationRealmSlug: String(specificationRealmById[String(specificationProposalKind[EntityMetaKey.Selector].realm)].slug ?? ''),
					proposalKindSlug: String(proposalCategoryById[String(specificationProposalKind[EntityMetaKey.Selector].category)].slug ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((specificationProposalKindFields.labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(specificationProposalKindFields.category)]?.labelPlural ?? (String((specificationProposalKindFields.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
			{/snippet}

			{#snippet Value()}
				{[String((specificationProposalKindFields.label) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
