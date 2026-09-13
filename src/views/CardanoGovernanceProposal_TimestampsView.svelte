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
	}: EntityListViewProps<EntityType.CardanoGovernanceProposal_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoGovernanceProposal_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				epoch: true,
				status: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoGovernanceProposalTimestamp })}
		{@const cardanoGovernanceProposalTimestampSelector = cardanoGovernanceProposalTimestamp[EntityMetaKey.Selector]}
		{@const proposal = cardanoGovernanceProposalTimestampSelector.$proposal}
		<EntityView
			entityType={EntityType.CardanoGovernanceProposal_Timestamp}
			entitySelector={cardanoGovernanceProposalTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]/(cardanoGovernanceProposal)/observations/[epoch=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							proposal.$network.caip2 !== undefined ?
								caip2StringFromValue(proposal.$network.caip2)
							:
								proposal.$network.slug
						),
						proposalTxHash: proposal.proposalTxHash,
						proposalIndex: String(proposal.proposalIndex),
						epoch: String(cardanoGovernanceProposalTimestampSelector.epoch),
						source: cardanoGovernanceProposalTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{'Epoch ' + cardanoGovernanceProposalTimestampSelector.epoch}
			{/snippet}

			{#snippet Value()}
				{cardanoGovernanceProposalTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cardanoGovernanceProposalTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
