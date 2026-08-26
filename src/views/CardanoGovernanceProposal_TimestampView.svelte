<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoGovernanceProposal_Timestamp>, 'prefetched'> = $props()

	const proposal = $derived(selection.entitySelector.$proposal)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	}))
	const cardanoGovernanceProposalTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Epoch ' + String(selection.entitySelector.epoch)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]/(cardanoGovernanceProposal)/observations/[epoch=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in proposal.$network ?
							caip2StringFromValue(proposal.$network.caip2)
						:
							proposal.$network.slug
					),
					proposalTxHash: proposal.proposalTxHash,
					proposalIndex: String(proposal.proposalIndex),
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
		<ResourceBoundary resource={cardanoGovernanceProposalTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || 'Epoch ' + String(selection.entitySelector.epoch)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>proposal</dt>
				<dd>
					<CardanoGovernanceProposalView
						selection={select(EntityType.CardanoGovernanceProposal, selection.entitySelector.$proposal)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoGovernanceProposalTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							ratifiedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ratifiedEpoch = entity.ratifiedEpoch}
					{#if ratifiedEpoch != null}
						<div>
							<dt>ratified epoch</dt>
							<dd>
								{ratifiedEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							enactedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enactedEpoch = entity.enactedEpoch}
					{#if enactedEpoch != null}
						<div>
							<dt>enacted epoch</dt>
							<dd>
								{enactedEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							droppedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const droppedEpoch = entity.droppedEpoch}
					{#if droppedEpoch != null}
						<div>
							<dt>dropped epoch</dt>
							<dd>
								{droppedEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expiredEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiredEpoch = entity.expiredEpoch}
					{#if expiredEpoch != null}
						<div>
							<dt>expired epoch</dt>
							<dd>
								{expiredEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expirationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationEpoch = entity.expirationEpoch}
					{#if expirationEpoch != null}
						<div>
							<dt>expiration epoch</dt>
							<dd>
								{expirationEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
