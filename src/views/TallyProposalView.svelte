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
	}: EntitySelectionViewProps<EntityType.TallyProposal> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Tally,
		],
	}))
	const tallyProposal = $derived(viewSelection({
		fields: {
			title: true,
			status: true,
			onchainId: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || [(prefetched.onchainId ? 'Proposal ' + prefetched.onchainId : ''), selection.entitySelector.proposalId].filter(Boolean).join(' ') || 'Tally proposal')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TallyGovernorView from '$/views/TallyGovernorView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TallyProposal}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/tally/proposal/[proposalId=stringSegment]',
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
		<ResourceBoundary resource={tallyProposal}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tallyProposal}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), (entity.onchainId ?? '')].filter(Boolean).join(' ') || (entity.title ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$governor}
		>
			{#snippet children(tallyGovernor)}
				<span data-text="muted">
					<TallyGovernorView
						selection={select(EntityType.TallyGovernor, tallyGovernor[EntityMetaKey.Selector])}
						prefetched={tallyGovernor}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Governor</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$governor}
					>
						{#snippet children(tallyGovernor)}
							<TallyGovernorView
								selection={select(EntityType.TallyGovernor, tallyGovernor[EntityMetaKey.Selector])}
								prefetched={tallyGovernor}
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
				resource={selection.$proposer}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
						<div>
							<dt>Proposer</dt>
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

			<ResourceBoundary
				resource={tallyProposal}
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
				resource={tallyProposal}
			>
				{#snippet children(entity)}
					{@const onchainId = entity.onchainId}
					{#if onchainId != null}
						<div>
							<dt>Onchain ID</dt>
							<dd>
								{onchainId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							organizationName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const organizationName = entity.organizationName}
					{#if organizationName != null}
						<div>
							<dt>Organization</dt>
							<dd>
								{organizationName}
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
								{startAtMs}
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
								{endAtMs}
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
				resource={
					viewSelection({
						fields: {
							discourseUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const discourseUrl = entity.discourseUrl}
					{#if discourseUrl != null}
						<div>
							<dt>Discourse</dt>
							<dd>
								<a
									href={discourseUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={discourseUrl} />
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
							snapshotUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const snapshotUrl = entity.snapshotUrl}
					{#if snapshotUrl != null}
						<div>
							<dt>Snapshot URL</dt>
							<dd>
								<a
									href={snapshotUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={snapshotUrl} />
								</a>
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
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					{description}
				{:else}
					<p data-text="muted">No proposal description.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
