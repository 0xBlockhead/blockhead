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
	}: EntityListViewProps<EntityType.CardanoGovernanceVote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoGovernanceVote}
	bind:open
	resource={
		selection({
			fields: {
				vote: true,
				voterKind: true,
				voterCredential: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoGovernanceVote })}
		{@const cardanoGovernanceVoteSelector = cardanoGovernanceVote[EntityMetaKey.Selector]}
		{@const proposal = cardanoGovernanceVoteSelector.$proposal}
		<EntityView
			entityType={EntityType.CardanoGovernanceVote}
			entitySelector={cardanoGovernanceVoteSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]/(cardanoGovernanceProposal)/vote/[voterKind=stringSegment]/[voterCredential=stringSegment]/[voteTxHash=stringSegment]/[source=stringSegment]',
					{
						network: (
							proposal.$network.caip2 !== undefined ?
								caip2StringFromValue(proposal.$network.caip2)
							:
								proposal.$network.slug
						),
						proposalTxHash: proposal.proposalTxHash,
						proposalIndex: String(proposal.proposalIndex),
						voterKind: cardanoGovernanceVoteSelector.voterKind,
						voterCredential: cardanoGovernanceVoteSelector.voterCredential,
						voteTxHash: cardanoGovernanceVoteSelector.voteTxHash,
						source: cardanoGovernanceVoteSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoGovernanceVote.vote || 'Cardano governance vote'}
			{/snippet}

			{#snippet Value()}
				{[cardanoGovernanceVoteSelector.voterKind, cardanoGovernanceVoteSelector.voterCredential].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
