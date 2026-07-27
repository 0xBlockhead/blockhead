<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoCommittee_Epoch> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived((String(pendingEntity.epoch ?? '') ? 'Epoch ' + String(pendingEntity.epoch ?? '') : '') || 'Cardano committee epoch')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoCommittee_Epoch}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				epoch: String(selection.entitySelector.epoch),
				source: String(selection.entitySelector.source),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(String(pendingEntity.epoch ?? '') ? 'Epoch ' + String(pendingEntity.epoch ?? '') : '') || 'Cardano committee epoch'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoCommitteeEpoch}>
			{#snippet children(entity)}
				{String(entity.memberCount ?? '') || (String(pendingEntity.epoch) ? 'Epoch ' + String(pendingEntity.epoch) : '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					{String(pendingEntity.epoch)}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
						<div>
							<dt>seating proposal</dt>
							<dd>
								<CardanoGovernanceProposalView
									selection={select(EntityType.CardanoGovernanceProposal, cardanoGovernanceProposal[EntityMetaKey.Selector])}
									prefetched={cardanoGovernanceProposal}
									layout={EntityLayout.Value}
									open={false}
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
								{String(quorumNumerator)}
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
								{String(quorumDenominator)}
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
								{String(memberCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource = selection.$$votes}
		<ResourceBoundary
			resource={cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CardanoGovernanceVotesView
						selection={cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource}
						countResource={cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource.count}
						title='votes'
						id='votes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
