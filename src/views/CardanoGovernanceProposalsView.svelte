<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CardanoGovernanceProposal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoGovernanceProposal}
	bind:open
	resource={
		selection({
			fields: {
				proposalKind: true,
				governanceActionId: true,
				proposalTxHash: true,
				proposalIndex: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoGovernanceProposal })}
		{@const cardanoGovernanceProposalSelector = cardanoGovernanceProposal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoGovernanceProposal}
			entitySelector={cardanoGovernanceProposalSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in cardanoGovernanceProposalSelector.$network ?
								String(caip2StringFromValue(cardanoGovernanceProposalSelector.$network.caip2))
							:
								String(cardanoGovernanceProposalSelector.$network.slug)
						),
						proposalTxHash: String(cardanoGovernanceProposalSelector.proposalTxHash),
						proposalIndex: String(cardanoGovernanceProposalSelector.proposalIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{[cardanoGovernanceProposal.proposalKind, (cardanoGovernanceProposal.governanceActionId ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal'}
			{/snippet}

			{#snippet Value()}
				{[(cardanoGovernanceProposalSelector.proposalTxHash ? 'Proposal ' + cardanoGovernanceProposalSelector.proposalTxHash : ''), (String(cardanoGovernanceProposalSelector.proposalIndex) ? '#' + String(cardanoGovernanceProposalSelector.proposalIndex) : '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
