<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.CardanoGovernanceProposal> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const cardanoGovernanceProposal = $derived(selection({
		fields: {
			proposalKind: true,
			governanceActionId: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.proposalKind ?? ''), (pendingEntity.governanceActionId ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoGovernanceProposal_TimestampsView from '$/views/CardanoGovernanceProposal_TimestampsView.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceProposal}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				proposalTxHash: String(selection.entitySelector.proposalTxHash),
				proposalIndex: String(selection.entitySelector.proposalIndex),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoGovernanceProposal}>
			{#snippet children(entity)}
				{[entity.proposalKind, (entity.governanceActionId ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{([((pendingEntity.proposalTxHash ?? '') ? 'Proposal ' + (pendingEntity.proposalTxHash ?? '') : ''), (String(pendingEntity.proposalIndex ?? '') ? '#' + String(pendingEntity.proposalIndex ?? '') : '')].filter(Boolean).join(' ')) || [(pendingEntity.proposalKind ?? ''), (pendingEntity.governanceActionId ?? '')].filter(Boolean).join(' ') || titleFallback}
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
									prefetched={cardanoTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>proposal kind</dt>
				<dd>
					<ResourceBoundary
						resource={cardanoGovernanceProposal}
					>
						{#snippet children(entity)}
							{entity.proposalKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoGovernanceProposal}
			>
				{#snippet children(entity)}
					{@const governanceActionId = entity.governanceActionId}
					{#if governanceActionId != null}
						<div>
							<dt>governance action ID</dt>
							<dd>
								{governanceActionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$previousAction}
			>
				{#snippet children(cardanoGovernanceProposal)}
					{#if cardanoGovernanceProposal != null}
						<div>
							<dt>previous action</dt>
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
					selection({
						fields: {
							depositLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositLovelace = entity.depositLovelace}
					{#if depositLovelace != null}
						<div>
							<dt>deposit lovelace</dt>
							<dd>
								<NumberValue
									value={depositLovelace}
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
					selection({
						fields: {
							returnAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const returnAddress = entity.returnAddress}
					{#if returnAddress != null}
						<div>
							<dt>return address</dt>
							<dd>
								<TruncatedValue value={returnAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
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
							policyHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const policyHash = entity.policyHash}
					{#if policyHash != null}
						<div>
							<dt>policy hash</dt>
							<dd>
								<TruncatedValue value={policyHash} />
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
							hardForkMajor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hardForkMajor = entity.hardForkMajor}
					{#if hardForkMajor != null}
						<div>
							<dt>hard fork major version</dt>
							<dd>
								{String(hardForkMajor)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hardForkMinor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hardForkMinor = entity.hardForkMinor}
					{#if hardForkMinor != null}
						<div>
							<dt>hard fork minor version</dt>
							<dd>
								{String(hardForkMinor)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>treasury withdrawals</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									treasuryWithdrawals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.treasuryWithdrawals.values.map((value) => `${value.recipientNetwork}:${value.recipientCredential} • ${value.lovelace.toString()} lovelace`).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>committee removals</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									committeeRemovedCredentials: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.committeeRemovedCredentials.values.join(', ')} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>committee additions</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									committeeAdditions: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.committeeAdditions.values.map((value) => `${value.credential} until epoch ${value.expirationEpoch}`).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							committeeQuorumNumerator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const committeeQuorumNumerator = entity.committeeQuorumNumerator}
					{#if committeeQuorumNumerator != null}
						<div>
							<dt>committee quorum numerator</dt>
							<dd>
								{String(committeeQuorumNumerator)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							committeeQuorumDenominator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const committeeQuorumDenominator = entity.committeeQuorumDenominator}
					{#if committeeQuorumDenominator != null}
						<div>
							<dt>committee quorum denominator</dt>
							<dd>
								{String(committeeQuorumDenominator)}
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
							constitutionAnchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const constitutionAnchorUrl = entity.constitutionAnchorUrl}
					{#if constitutionAnchorUrl != null}
						<div>
							<dt>constitution anchor URL</dt>
							<dd>
								<a
									href={String(constitutionAnchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(constitutionAnchorUrl)} />
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
							constitutionAnchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const constitutionAnchorHash = entity.constitutionAnchorHash}
					{#if constitutionAnchorHash != null}
						<div>
							<dt>constitution anchor hash</dt>
							<dd>
								<TruncatedValue value={constitutionAnchorHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							constitutionScript: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const constitutionScript = entity.constitutionScript}
					{#if constitutionScript != null}
						<div>
							<dt>constitution script</dt>
							<dd>
								{constitutionScript}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CardanoGovernanceProposal_TimestampsView
						selection={cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource}
						countResource={cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource = selection.$$votes}
		<ResourceBoundary
			resource={cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CardanoGovernanceVotesView
						selection={cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource}
						countResource={cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource.count}
						title='votes'
						id='votes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
