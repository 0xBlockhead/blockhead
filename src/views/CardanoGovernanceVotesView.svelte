<!-- Generated from APP.ts. Do not edit by hand. -->

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
		<EntityView
			entityType={EntityType.CardanoGovernanceVote}
			entitySelector={cardanoGovernanceVoteSelector}
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
