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
	}: EntityListViewProps<EntityType.SnapshotProposal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SnapshotProposal}
	bind:open
	resource={
		selection({
			...{
				fields: {
					title: true,
					state: true,
					votesCount: true,
					proposalId: true,
					$space: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: snapshotProposal })}
		{@const snapshotProposalSelector = snapshotProposal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SnapshotProposal}
			entitySelector={snapshotProposalSelector}
			href={
				resolve(
					'/~/snapshot/proposal/[proposalId=stringSegment]',
					{
						proposalId: encodeURIComponent(snapshotProposalSelector.proposalId),
					}
				)
			}
		>
			{#snippet Title()}
				{(snapshotProposal.title ?? '') || snapshotProposalSelector.proposalId || 'Snapshot proposal'}
			{/snippet}

			{#snippet Value()}
				{[(snapshotProposal.state ?? ''), String(snapshotProposal.votesCount ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(snapshotProposal.$space.name ?? '') || snapshotProposal.$space.spaceId || 'Snapshot space'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
