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
	import { defaultSpecificationProposalSources, specificationProposalSourceSelectionByKey } from '$/sources/$sourceSelections.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Proposals',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationProposals-list',
		filterRealm,
		filterCategory,
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SpecificationProposal>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
			filterRealm?: unknown
			filterCategory?: unknown
		},
		EntitiesListForwardProps
	> = $props()
	const selectedSources = $derived(specificationProposalSourceSelectionByKey[[String(filterRealm), String(filterCategory)].join(':')] ?? defaultSpecificationProposalSources)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		These proposal cards come from public standards repositories for Bitcoin BIPs, Zcash ZIPs, Filecoin FIPs, Solana SIMDs, CAIPs, ENSIPs, and Ethereum EIPs/ERCs.
	</p>

	<p>
		They document design specs, not live on-chain vote tallies for a particular DAO.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationProposal}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selectedSources,
		})
	}
	{countResource}
	getResourceItems={(specificationProposals) => [...new Map(specificationProposals.values.filter((specificationProposal) => (filterRealm == null || specificationProposal[EntityMetaKey.Selector].realm === filterRealm) && (filterCategory == null || specificationProposal[EntityMetaKey.Selector].category === filterCategory)).map((specificationProposal) => [specificationProposal[EntityMetaKey.SelectorKey], specificationProposal])).values()]}
	getKey={(specificationProposal) => specificationProposal[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Specification proposals yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: specificationProposal })}
		{@const specificationProposalFields = { ...specificationProposal[EntityMetaKey.Selector], ...specificationProposal }}
		<EntityView
			entityType={EntityType.SpecificationProposal}
			entitySelector={specificationProposal[EntityMetaKey.Selector]}
			href={
				(
					specificationProposal[EntityMetaKey.Selector] != null && 'realm' in specificationProposal[EntityMetaKey.Selector]
					&& specificationProposal[EntityMetaKey.Selector].realm != null
					&& specificationProposal[EntityMetaKey.Selector] != null && 'category' in specificationProposal[EntityMetaKey.Selector]
					&& specificationProposal[EntityMetaKey.Selector].category != null
					&& specificationProposal[EntityMetaKey.Selector] != null && 'number' in specificationProposal[EntityMetaKey.Selector]
					&& specificationProposal[EntityMetaKey.Selector].number != null ?
						resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]/[proposalRef=proposalRef]', {
					specificationRealmSlug: String(specificationRealmById[String(specificationProposal[EntityMetaKey.Selector].realm)].slug ?? ''),
					proposalKindSlug: String(proposalCategoryById[String(specificationProposal[EntityMetaKey.Selector].category)].slug ?? ''),
					proposalRef: `${String(String(proposalCategoryById[String(specificationProposal[EntityMetaKey.Selector].category)].label ?? '') ?? '')}-${String(String(specificationProposal[EntityMetaKey.Selector].number ?? '') ?? '')}`,
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
				{[[
		[(String((proposalCategoryById[String(specificationProposalFields.category)]?.label ?? (String((specificationProposalFields.category) ?? ''))) ?? '') ? String((proposalCategoryById[String(specificationProposalFields.category)]?.label ?? (String((specificationProposalFields.category) ?? ''))) ?? '') + '-' : ''), String((specificationProposalFields.number) ?? '')].filter(Boolean).join(''),
		String((specificationProposalFields.documentTitle) ?? ''),
	].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
		[String((proposalCategoryById[String(specificationProposalFields.category)]?.label ?? (String((specificationProposalFields.category) ?? ''))) ?? '')].filter(Boolean).join(''),
		String((specificationProposalFields.number) ?? ''),
	].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal'}
			{/snippet}

			{#snippet Value()}
				{[[
		[String((proposalCategoryById[String(specificationProposalFields.category)]?.label ?? (String((specificationProposalFields.category) ?? ''))) ?? '')].filter(Boolean).join(''),
		String((specificationProposalFields.number) ?? ''),
	].filter(Boolean).join('-')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
