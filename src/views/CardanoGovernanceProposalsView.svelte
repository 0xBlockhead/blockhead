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
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoGovernanceProposal>
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
				governanceActionId: true,
				proposalTxHash: true,
				proposalIndex: true,
				$network: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.CardanoGovernanceProposal}
			entitySelector={cardanoGovernanceProposal[EntityMetaKey.Selector]}
			href={
				(
					cardanoGovernanceProposal[EntityMetaKey.Selector] != null && 'proposalTxHash' in cardanoGovernanceProposal[EntityMetaKey.Selector]
					&& cardanoGovernanceProposal[EntityMetaKey.Selector].proposalTxHash != null
					&& cardanoGovernanceProposal[EntityMetaKey.Selector] != null && 'proposalIndex' in cardanoGovernanceProposal[EntityMetaKey.Selector]
					&& cardanoGovernanceProposal[EntityMetaKey.Selector].proposalIndex != null
					&& cardanoGovernanceProposal[EntityMetaKey.Selector] != null && '$network' in cardanoGovernanceProposal[EntityMetaKey.Selector] ?
						cardanoGovernanceProposal[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoGovernanceProposal[EntityMetaKey.Selector].$network
						&& cardanoGovernanceProposal[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
						proposalTxHash: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalTxHash ?? ''),
						proposalIndex: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalIndex ?? ''),
						network: String(caip2StringFromValue(cardanoGovernanceProposal[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cardanoGovernanceProposal[EntityMetaKey.Selector].$network != null && 'slug' in cardanoGovernanceProposal[EntityMetaKey.Selector].$network
							&& cardanoGovernanceProposal[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
							proposalTxHash: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalTxHash ?? ''),
							proposalIndex: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalIndex ?? ''),
							network: String(cardanoGovernanceProposal[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cardanoGovernanceProposalFields.proposalKind) ?? ''), String((cardanoGovernanceProposalFields.governanceActionId) ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal'}
			{/snippet}

			{#snippet Value()}
				{[(String((cardanoGovernanceProposalFields.proposalTxHash) ?? '') ? 'Proposal ' + String((cardanoGovernanceProposalFields.proposalTxHash) ?? '') : ''), (String((cardanoGovernanceProposalFields.proposalIndex) ?? '') ? '#' + String((cardanoGovernanceProposalFields.proposalIndex) ?? '') : '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
