<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoCommittee_Epoch>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	}))
	const cardanoCommitteeEpoch = $derived(viewSelection({
		fields: {
			memberCount: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoCommittee_Epoch}
	entitySelector={selection.entitySelector}
	title={title ?? 'Epoch ' + String(selection.entitySelector.epoch)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					epoch: String(selection.entitySelector.epoch),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={cardanoCommitteeEpoch}>
			{#snippet children(entity)}
				{String(entity.memberCount ?? '') || 'Epoch ' + String(selection.entitySelector.epoch)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					{selection.entitySelector.epoch}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>dissolved</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									dissolved: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.dissolved ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							govActionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const govActionId = entity.govActionId}
					{#if govActionId != null}
						<div>
							<dt>governance action ID</dt>
							<dd>
								{govActionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$seatingProposal}
			>
				{#snippet children(cardanoGovernanceProposal)}
					{#if cardanoGovernanceProposal != null}
						{@const cardanoGovernanceProposalInitial = untrack(() => cardanoGovernanceProposal)}
						<div>
							<dt>seating proposal</dt>
							<dd>
								<CardanoGovernanceProposalView
									selection={select(EntityType.CardanoGovernanceProposal, (cardanoGovernanceProposal ?? cardanoGovernanceProposalInitial)[EntityMetaKey.Selector])}
									prefetched={cardanoGovernanceProposal ?? cardanoGovernanceProposalInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quorumNumerator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quorumNumerator = entity.quorumNumerator}
					{#if quorumNumerator != null}
						<div>
							<dt>quorum numerator</dt>
							<dd>
								{quorumNumerator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quorumDenominator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quorumDenominator = entity.quorumDenominator}
					{#if quorumDenominator != null}
						<div>
							<dt>quorum denominator</dt>
							<dd>
								{quorumDenominator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cardanoCommitteeEpoch}
			>
				{#snippet children(entity)}
					{@const memberCount = entity.memberCount}
					{#if memberCount != null}
						<div>
							<dt>member count</dt>
							<dd>
								{memberCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const votesResource = selection.$$votes}
		<ResourceBoundary
			resource={votesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CardanoGovernanceVotesView
						selection={votesResource}
						countResource={votesResource.count}
						title='votes'
						id='votes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
