<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.CosmosGovernanceProposal_Timestamp> = $props()

	const proposal = $derived(selection.entitySelector.$proposal)
	const cosmosGovernanceProposalTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([(prefetched.status ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || 'Cosmos governance proposal timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalId=stringSegment]/(cosmosGovernanceProposal)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in proposal.$network ?
							caip2StringFromValue(proposal.$network.caip2)
						:
							proposal.$network.slug
					),
					proposalId: proposal.proposalId,
					timestampMs: String(selection.entitySelector.timestampMs),
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
	{#snippet Title()}
		<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || [(entity.status ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={cosmosGovernanceProposalTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							submitTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const submitTimeMs = entity.submitTimeMs}
					{#if submitTimeMs != null}
						<div>
							<dt>Submit time</dt>
							<dd>
								{submitTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							depositEndTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositEndTimeMs = entity.depositEndTimeMs}
					{#if depositEndTimeMs != null}
						<div>
							<dt>Deposit end time</dt>
							<dd>
								{depositEndTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							votingStartTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingStartTimeMs = entity.votingStartTimeMs}
					{#if votingStartTimeMs != null}
						<div>
							<dt>Voting start time</dt>
							<dd>
								{votingStartTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							votingEndTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingEndTimeMs = entity.votingEndTimeMs}
					{#if votingEndTimeMs != null}
						<div>
							<dt>Voting end time</dt>
							<dd>
								{votingEndTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadata: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadata = entity.metadata}
					{#if metadata != null}
						<div>
							<dt>Metadata</dt>
							<dd>
								{metadata}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Proposal</dt>
				<dd>
					<CosmosGovernanceProposalView
						selection={select(EntityType.CosmosGovernanceProposal, selection.entitySelector.$proposal)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
