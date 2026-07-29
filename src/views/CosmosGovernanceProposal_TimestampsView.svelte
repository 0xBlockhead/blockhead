<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			fields: {
				status: true,
				source: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosGovernanceProposalTimestamp })}
		{@const cosmosGovernanceProposalTimestampSelector = cosmosGovernanceProposalTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosGovernanceProposal_Timestamp}
			entitySelector={cosmosGovernanceProposalTimestampSelector}
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
