<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmById, proposalCategoryById } from '$/constants/SpecificationProposal.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SpecificationProposalKind>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'
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
		{@const selection = select(EntityType.SpecificationProposalKind, specificationProposalKind[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const specificationProposalKindHrefFields = { ...specificationProposalKind, ...specificationProposalKind[EntityMetaKey.Selector] }}
		<SpecificationProposalKindView
			selection={selection}
			prefetched={specificationProposalKindFields}
			href={
				(specificationProposalKindHrefFields.realm !== undefined && specificationProposalKindHrefFields.category !== undefined ? resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]', {
					specificationRealmSlug: String(specificationRealmById[String(specificationProposalKindHrefFields.realm)].slug ?? ''),
					proposalKindSlug: String(proposalCategoryById[String(specificationProposalKindHrefFields.category)].slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
