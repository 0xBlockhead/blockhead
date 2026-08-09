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
		title = 'Lifecycle snapshots',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosGovernanceProposal_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosGovernanceProposal_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					status: true,
					source: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cosmosGovernanceProposalTimestamp })}
		{@const cosmosGovernanceProposalTimestampSelector = cosmosGovernanceProposalTimestamp[EntityMetaKey.Selector]}
		{@const proposal = cosmosGovernanceProposalTimestampSelector.$proposal}
		<EntityView
			entityType={EntityType.CosmosGovernanceProposal_Timestamp}
			entitySelector={cosmosGovernanceProposalTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalId=stringSegment]/(cosmosGovernanceProposal)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in proposal.$network ?
								caip2StringFromValue(proposal.$network.caip2)
							:
								proposal.$network.slug
						),
						proposalId: proposal.proposalId,
						timestampMs: String(cosmosGovernanceProposalTimestampSelector.timestampMs),
						source: cosmosGovernanceProposalTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[(cosmosGovernanceProposalTimestamp.status ?? ''), cosmosGovernanceProposalTimestampSelector.source].filter(Boolean).join(' ') || 'Cosmos governance proposal timestamp'}
			{/snippet}

			{#snippet Value()}
				{cosmosGovernanceProposalTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosGovernanceProposalTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
