<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.CosmosGovernanceProposal}
			entitySelector={cosmosGovernanceProposalSelector}
		>
			{#snippet Title()}
				{[(cosmosGovernanceProposal.title ?? ''), 'Proposal ' + cosmosGovernanceProposalSelector.proposalId].filter(Boolean).join(' ') || 'Cosmos governance proposal'}
			{/snippet}

			{#snippet Value()}
				{'Proposal ' + cosmosGovernanceProposalSelector.proposalId}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosGovernanceProposal.$network.name || (cosmosGovernanceProposalSelector.$network.caip2 == null ? '' : `${cosmosGovernanceProposalSelector.$network.caip2.namespace}:${cosmosGovernanceProposalSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
