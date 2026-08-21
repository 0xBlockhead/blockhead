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
		title = 'Executable calls',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TallyProposalExecutableCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TallyProposalExecutableCall}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					index: true,
					$proposal: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: tallyProposalExecutableCall })}
		{@const tallyProposalExecutableCallSelector = tallyProposalExecutableCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TallyProposalExecutableCall}
			entitySelector={tallyProposalExecutableCallSelector}
			href={
				resolve(
					'/~/tally/proposal/[proposalId=stringSegment]/(tallyProposal)/executable-call/[index=nonNegativeInteger]',
					{
						proposalId: encodeURIComponent(tallyProposalExecutableCallSelector.$proposal.proposalId),
						index: String(tallyProposalExecutableCallSelector.index),
					}
				)
			}
		>
			{#snippet Title()}
				{'Call #' + tallyProposalExecutableCallSelector.index}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(tallyProposalExecutableCall.$proposal.title ?? '') || [(tallyProposalExecutableCall.$proposal.onchainId ? 'Proposal ' + tallyProposalExecutableCall.$proposal.onchainId : ''), tallyProposalExecutableCallSelector.$proposal.proposalId].filter(Boolean).join(' ') || 'Tally proposal'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
