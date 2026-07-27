<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoGovernanceProposal_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived((String(pendingEntity.epoch ?? '') ? 'Epoch ' + String(pendingEntity.epoch ?? '') : '') || 'Cardano governance proposal timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(String(pendingEntity.epoch ?? '') ? 'Epoch ' + String(pendingEntity.epoch ?? '') : '') || 'Cardano governance proposal timestamp'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoGovernanceProposalTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || (String(pendingEntity.epoch) ? 'Epoch ' + String(pendingEntity.epoch) : '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>proposal</dt>
				<dd>
					<CardanoGovernanceProposalView
						selection={select(EntityType.CardanoGovernanceProposal, selection.entitySelector.$proposal)}
						layout={EntityLayout.Value}
						open={false}
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
								{String(ratifiedEpoch)}
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
								{String(enactedEpoch)}
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
								{String(droppedEpoch)}
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
								{String(expiredEpoch)}
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
								{String(expirationEpoch)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
