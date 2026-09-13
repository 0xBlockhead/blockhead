<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoGovernanceVote> = $props()

	const proposal = $derived(selection.entitySelector.$proposal)
	const cardanoGovernanceVote = $derived(selection({
		fields: {
			vote: true,
		},
	}))
	const titleFallback = $derived((prefetched.vote ?? '') || 'Cardano governance vote')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceVote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]/(cardanoGovernanceProposal)/vote/[voterKind=stringSegment]/[voterCredential=stringSegment]/[voteTxHash=stringSegment]/[source=stringSegment]',
				{
					network: (
						proposal.$network.caip2 !== undefined ?
							caip2StringFromValue(proposal.$network.caip2)
						:
							proposal.$network.slug
					),
					proposalTxHash: proposal.proposalTxHash,
					proposalIndex: String(proposal.proposalIndex),
					voterKind: selection.entitySelector.voterKind,
					voterCredential: selection.entitySelector.voterCredential,
					voteTxHash: selection.entitySelector.voteTxHash,
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
		<ResourceBoundary resource={cardanoGovernanceVote}>
			{#snippet children(entity)}
				{entity.vote || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{[selection.entitySelector.voterKind, selection.entitySelector.voterCredential].filter(Boolean).join(' ') || (prefetched.vote ?? '') || titleFallback}
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

			<div>
				<dt>vote</dt>
				<dd>
					<ResourceBoundary
						resource={cardanoGovernanceVote}
					>
						{#snippet children(entity)}
							{entity.vote}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>voter kind</dt>
				<dd>
					{selection.entitySelector.voterKind}
				</dd>
			</div>

			<div>
				<dt>voter credential</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.voterCredential} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$drep}
			>
				{#snippet children(cardanoDRep)}
					{#if cardanoDRep != null}
						{@const cardanoDRepInitial = untrack(() => cardanoDRep)}
						<div>
							<dt>drep</dt>
							<dd>
								<CardanoDRepView
									selection={select(EntityType.CardanoDRep, (cardanoDRep ?? cardanoDRepInitial)[EntityMetaKey.Selector])}
									prefetched={cardanoDRep ?? cardanoDRepInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$stakePool}
			>
				{#snippet children(cardanoStakePool)}
					{#if cardanoStakePool != null}
						{@const cardanoStakePoolInitial = untrack(() => cardanoStakePool)}
						<div>
							<dt>stake pool</dt>
							<dd>
								<CardanoStakePoolView
									selection={select(EntityType.CardanoStakePool, (cardanoStakePool ?? cardanoStakePoolInitial)[EntityMetaKey.Selector])}
									prefetched={cardanoStakePool ?? cardanoStakePoolInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(cardanoTransaction)}
					{#if cardanoTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<CardanoTransactionView
									selection={select(EntityType.CardanoTransaction, cardanoTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>vote transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.voteTxHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							voteIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const voteIndex = entity.voteIndex}
					{#if voteIndex != null}
						<div>
							<dt>vote index</dt>
							<dd>
								{voteIndex}
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
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const anchorUrl = entity.anchorUrl}
					{#if anchorUrl != null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<a
									href={anchorUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={anchorUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const anchorHash = entity.anchorHash}
					{#if anchorHash != null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={anchorHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epoch = entity.epoch}
					{#if epoch != null}
						<div>
							<dt>epoch</dt>
							<dd>
								{epoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>slot</dt>
							<dd>
								{slot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
