<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Cardano governance proposals',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoGovernanceProposals-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CardanoGovernanceProposal>
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
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoGovernanceProposal}
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
				proposalKind: true,
				proposalTxHash: true,
				proposalIndex: true,
				$network: true,
			},
		})
	}
	getResourceItems={(cardanoGovernanceProposals) => [...new Map(cardanoGovernanceProposals.values.map((cardanoGovernanceProposal) => [cardanoGovernanceProposal[EntityMetaKey.SelectorKey], cardanoGovernanceProposal])).values()]}
	getKey={(cardanoGovernanceProposal) => cardanoGovernanceProposal[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano governance proposals yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoGovernanceProposal })}
		{@const cardanoGovernanceProposalFields = { ...cardanoGovernanceProposal[EntityMetaKey.Selector], ...cardanoGovernanceProposal }}
		{@const selection = select(EntityType.CardanoGovernanceProposal, cardanoGovernanceProposal[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const cardanoGovernanceProposalHrefFields = { ...cardanoGovernanceProposal, ...cardanoGovernanceProposal[EntityMetaKey.Selector] }}
		<CardanoGovernanceProposalView
			selection={selection}
			prefetched={cardanoGovernanceProposalFields}
			href={
				(cardanoGovernanceProposalHrefFields.proposalTxHash !== undefined && cardanoGovernanceProposalHrefFields.proposalIndex !== undefined && cardanoGovernanceProposalHrefFields.$network !== undefined && cardanoGovernanceProposalHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
					proposalTxHash: String(cardanoGovernanceProposalHrefFields.proposalTxHash ?? ''),
					proposalIndex: String(cardanoGovernanceProposalHrefFields.proposalIndex ?? ''),
					network: String(caip2StringFromValue(cardanoGovernanceProposalHrefFields.$network.caip2) ?? ''),
				}) : cardanoGovernanceProposalHrefFields.proposalTxHash !== undefined && cardanoGovernanceProposalHrefFields.proposalIndex !== undefined && cardanoGovernanceProposalHrefFields.$network !== undefined && cardanoGovernanceProposalHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
					proposalTxHash: String(cardanoGovernanceProposalHrefFields.proposalTxHash ?? ''),
					proposalIndex: String(cardanoGovernanceProposalHrefFields.proposalIndex ?? ''),
					network: String(cardanoGovernanceProposalHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
