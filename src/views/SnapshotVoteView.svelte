<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.SnapshotVote> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SnapshotHub_Graphql,
		],
	}))
	const snapshotVote = $derived(viewSelection({
		fields: {
			voter: true,
			votingPower: true,
		},
	}))
	const titleFallback = $derived((prefetched.voter ?? '') || 'Snapshot vote')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SnapshotProposalView from '$/views/SnapshotProposalView.svelte'
	import SnapshotSpaceView from '$/views/SnapshotSpaceView.svelte'
</script>


<EntityView
	entityType={EntityType.SnapshotVote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/snapshot/vote/[voteId=stringSegment]',
				{
					voteId: encodeURIComponent(selection.entitySelector.voteId),
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
		<ResourceBoundary resource={snapshotVote}>
			{#snippet children(entity)}
				{entity.voter || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={snapshotVote}>
			{#snippet children(entity)}
				{String(entity.votingPower ?? '') || entity.voter || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$proposal}
		>
			{#snippet children(snapshotProposal)}
				{@const snapshotProposalInitial = untrack(() => snapshotProposal)}
				<span data-text="muted">
					<SnapshotProposalView
						selection={select(EntityType.SnapshotProposal, (snapshotProposal ?? snapshotProposalInitial)[EntityMetaKey.Selector])}
						prefetched={snapshotProposal ?? snapshotProposalInitial}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Proposal</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$proposal}
					>
						{#snippet children(snapshotProposal)}
							{@const snapshotProposalInitial = untrack(() => snapshotProposal)}
							<SnapshotProposalView
								selection={select(EntityType.SnapshotProposal, (snapshotProposal ?? snapshotProposalInitial)[EntityMetaKey.Selector])}
								prefetched={snapshotProposal ?? snapshotProposalInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Space</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$space}
					>
						{#snippet children(snapshotSpace)}
							{@const snapshotSpaceInitial = untrack(() => snapshotSpace)}
							<SnapshotSpaceView
								selection={select(EntityType.SnapshotSpace, (snapshotSpace ?? snapshotSpaceInitial)[EntityMetaKey.Selector])}
								prefetched={snapshotSpace ?? snapshotSpaceInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Voter</dt>
				<dd>
					<ResourceBoundary
						resource={snapshotVote}
					>
						{#snippet children(entity)}
							{entity.voter}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Choice</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									choice: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{JSON.stringify(entity.choice)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									createdAtMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAtMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={snapshotVote}
			>
				{#snippet children(entity)}
					{@const votingPower = entity.votingPower}
					{#if votingPower != null}
						<div>
							<dt>Voting power</dt>
							<dd>
								{votingPower}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							votingPowerByStrategy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingPowerByStrategy = entity.votingPowerByStrategy}
					{#if votingPowerByStrategy != null}
						<div>
							<dt>Voting power by strategy</dt>
							<dd>
								{votingPowerByStrategy.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							votingPowerState: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingPowerState = entity.votingPowerState}
					{#if votingPowerState != null}
						<div>
							<dt>Voting power state</dt>
							<dd>
								{votingPowerState}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							votingPowerValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingPowerValue = entity.votingPowerValue}
					{#if votingPowerValue != null}
						<div>
							<dt>Voting power value</dt>
							<dd>
								{votingPowerValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reason = entity.reason}
					{#if reason != null}
						<div>
							<dt>Reason</dt>
							<dd>
								{reason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							app: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const app = entity.app}
					{#if app != null}
						<div>
							<dt>App</dt>
							<dd>
								{app}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							ipfs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ipfs = entity.ipfs}
					{#if ipfs != null}
						<div>
							<dt>IPFS ID</dt>
							<dd>
								{ipfs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
								{JSON.stringify(metadata)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
