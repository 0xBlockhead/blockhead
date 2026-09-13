<!-- Generated from APP.ts. -->

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
		{@const network = cardanoGovernanceProposalSelector.$network}
		<EntityView
			entityType={EntityType.CardanoGovernanceProposal}
			entitySelector={cardanoGovernanceProposalSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						proposalTxHash: cardanoGovernanceProposalSelector.proposalTxHash,
						proposalIndex: String(cardanoGovernanceProposalSelector.proposalIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{[cardanoGovernanceProposal.proposalKind, (cardanoGovernanceProposal.governanceActionId ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal'}
			{/snippet}

			{#snippet Value()}
				{['Proposal ' + cardanoGovernanceProposalSelector.proposalTxHash, '#' + String(cardanoGovernanceProposalSelector.proposalIndex)].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
