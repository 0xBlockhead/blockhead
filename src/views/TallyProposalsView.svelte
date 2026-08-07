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
	}: EntityListViewProps<EntityType.TallyProposal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TallyProposal}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				status: true,
				onchainId: true,
				proposalId: true,
				$governor: true,
			},
		})
	}
>
	{#snippet Item({ item: tallyProposal })}
		{@const tallyProposalSelector = tallyProposal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TallyProposal}
			entitySelector={tallyProposalSelector}
			href={
				resolve(
					'/tally/proposal/[proposalId=stringSegment]',
					{
						proposalId: encodeURIComponent(tallyProposalSelector.proposalId),
					}
				)
			}
		>
			{#snippet Title()}
				{(tallyProposal.title ?? '') || [(tallyProposal.onchainId ? 'Proposal ' + tallyProposal.onchainId : ''), tallyProposalSelector.proposalId].filter(Boolean).join(' ') || 'Tally proposal'}
			{/snippet}

			{#snippet Value()}
				{[(tallyProposal.status ?? ''), (tallyProposal.onchainId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(tallyProposal.$governor.name ?? ''), (tallyProposal.$governor.organizationName ?? '')].filter(Boolean).join(' ') || tallyProposal.$governor.governorId || 'Tally governor'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
