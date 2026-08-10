<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SnapshotVote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SnapshotVote}
	bind:open
	resource={
		selection({
			...{
				fields: {
					voter: true,
					votingPower: true,
					$proposal: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: snapshotVote })}
		{@const snapshotVoteSelector = snapshotVote[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SnapshotVote}
			entitySelector={snapshotVoteSelector}
			href={
				resolve(
					'/~/snapshot/vote/[voteId=stringSegment]',
					{
						voteId: encodeURIComponent(snapshotVoteSelector.voteId),
					}
				)
			}
		>
			{#snippet Title()}
				{snapshotVote.voter || 'Snapshot vote'}
			{/snippet}

			{#snippet Value()}
				{snapshotVote.votingPower ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(snapshotVote.$proposal.title ?? '') || snapshotVote.$proposal.proposalId || 'Snapshot proposal'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
