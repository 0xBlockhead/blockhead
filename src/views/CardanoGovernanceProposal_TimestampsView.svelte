<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.CardanoGovernanceProposal_Timestamp}
			entitySelector={cardanoGovernanceProposalTimestampSelector}
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
