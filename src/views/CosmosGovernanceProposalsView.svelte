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
		title = 'Governance proposals',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosGovernanceProposal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosGovernanceProposal}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				proposalId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosGovernanceProposal })}
		{@const cosmosGovernanceProposalSelector = cosmosGovernanceProposal[EntityMetaKey.Selector]}
		{@const network = cosmosGovernanceProposalSelector.$network}
		<EntityView
			entityType={EntityType.CosmosGovernanceProposal}
			entitySelector={cosmosGovernanceProposalSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						proposalId: cosmosGovernanceProposalSelector.proposalId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(cosmosGovernanceProposal.title ?? ''), 'Proposal ' + cosmosGovernanceProposalSelector.proposalId].filter(Boolean).join(' ') || 'Cosmos governance proposal'}
			{/snippet}

			{#snippet Value()}
				{'Proposal ' + cosmosGovernanceProposalSelector.proposalId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosGovernanceProposal.$network.name || (cosmosGovernanceProposal.$network.caip2 == null ? '' : `${cosmosGovernanceProposal.$network.caip2.namespace}:${cosmosGovernanceProposal.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
