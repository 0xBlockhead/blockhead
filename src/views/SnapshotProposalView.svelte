<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.SnapshotProposal> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SnapshotHub_Graphql,
		],
	}))
	const snapshotProposal = $derived(viewSelection({
		fields: {
			title: true,
			state: true,
			votesCount: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || selection.entitySelector.proposalId || 'Snapshot proposal')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SnapshotSpaceView from '$/views/SnapshotSpaceView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SnapshotProposal}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/snapshot/proposal/[proposalId=stringSegment]',
				{
					proposalId: encodeURIComponent(selection.entitySelector.proposalId),
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
		<ResourceBoundary resource={snapshotProposal}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={snapshotProposal}>
			{#snippet children(entity)}
				{[(entity.state ?? ''), String(entity.votesCount ?? '')].filter(Boolean).join(' ') || (entity.title ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$space}
		>
			{#snippet children(snapshotSpace)}
				<span data-text="muted">
					<SnapshotSpaceView
						selection={select(EntityType.SnapshotSpace, snapshotSpace[EntityMetaKey.Selector])}
						prefetched={snapshotSpace}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Space</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$space}
					>
						{#snippet children(snapshotSpace)}
							<SnapshotSpaceView
								selection={select(EntityType.SnapshotSpace, snapshotSpace[EntityMetaKey.Selector])}
								prefetched={snapshotSpace}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={snapshotProposal}
			>
				{#snippet children(entity)}
					{@const state = entity.state}
					{#if state != null}
						<div>
							<dt>State</dt>
							<dd>
								{state}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							type: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const type = entity.type}
					{#if type != null}
						<div>
							<dt>Type</dt>
							<dd>
								{type}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							author: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const author = entity.author}
					{#if author != null}
						<div>
							<dt>Author</dt>
							<dd>
								{author}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$authorAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
						<div>
							<dt>Author account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
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
							startAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startAtMs = entity.startAtMs}
					{#if startAtMs != null}
						<div>
							<dt>Starts</dt>
							<dd>
								<Timestamp timestamp={startAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							endAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endAtMs = entity.endAtMs}
					{#if endAtMs != null}
						<div>
							<dt>Ends</dt>
							<dd>
								<Timestamp timestamp={endAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const createdAtMs = entity.createdAtMs}
					{#if createdAtMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAtMs = entity.updatedAtMs}
					{#if updatedAtMs != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quorum: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quorum = entity.quorum}
					{#if quorum != null}
						<div>
							<dt>Quorum</dt>
							<dd>
								{quorum}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={snapshotProposal}
			>
				{#snippet children(entity)}
					{@const votesCount = entity.votesCount}
					{#if votesCount != null}
						<div>
							<dt>Votes</dt>
							<dd>
								{votesCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							scoresTotal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scoresTotal = entity.scoresTotal}
					{#if scoresTotal != null}
						<div>
							<dt>Scores total</dt>
							<dd>
								{scoresTotal}
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
							choices: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const choices = entity.choices}
					{#if choices != null}
						<div>
							<dt>Choices</dt>
							<dd>
								{choices.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							labels: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const labels = entity.labels}
					{#if labels != null}
						<div>
							<dt>Labels</dt>
							<dd>
								{labels.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							link: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const link = entity.link}
					{#if link != null}
						<div>
							<dt>Link</dt>
							<dd>
								<a
									href={link}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={link} />
								</a>
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

			<div>
				<dt>Proposal ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.proposalId} />
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						body: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const body = entity.body}
				{#if body != null && body !== ''}
					{body}
				{:else}
					<p data-text="muted">No proposal body.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
