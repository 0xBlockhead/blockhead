<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.CardanoGovernanceVote>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoGovernanceVote>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const cardanoGovernanceVote = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			vote: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			vote: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.vote) ?? '')].filter(Boolean).join(' ') || 'Cardano governance vote')
	const viewDomId = $derived('cardano-governance-vote-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'vote')}
			{[String((pendingEntity.vote) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceVote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.vote) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'vote')}
			{[String((pendingEntity.voterKind) ?? ''), String((pendingEntity.voterCredential) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.vote) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceVote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.voterKind) ?? ''), String((resolvedEntity.voterCredential) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.vote) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>proposal</dt>
				<dd>
					<CardanoGovernanceProposalView
						selection={select(EntityType.CardanoGovernanceProposal, selection.entitySelector.$proposal)}
						href={
							(
								selection.entitySelector.$proposal != null && 'proposalTxHash' in selection.entitySelector.$proposal
								&& selection.entitySelector.$proposal.proposalTxHash != null
								&& selection.entitySelector.$proposal != null && 'proposalIndex' in selection.entitySelector.$proposal
								&& selection.entitySelector.$proposal.proposalIndex != null
								&& selection.entitySelector.$proposal != null && '$network' in selection.entitySelector.$proposal ?
									selection.entitySelector.$proposal.$network != null && 'caip2' in selection.entitySelector.$proposal.$network
									&& selection.entitySelector.$proposal.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
									proposalTxHash: String(selection.entitySelector.$proposal.proposalTxHash ?? ''),
									proposalIndex: String(selection.entitySelector.$proposal.proposalIndex ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$proposal.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$proposal.$network != null && 'slug' in selection.entitySelector.$proposal.$network
										&& selection.entitySelector.$proposal.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
										proposalTxHash: String(selection.entitySelector.$proposal.proposalTxHash ?? ''),
										proposalIndex: String(selection.entitySelector.$proposal.proposalIndex ?? ''),
										network: String(selection.entitySelector.$proposal.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>vote</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									vote: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const vote = resolvedEntity.vote}
							{#if vote !== undefined && vote !== null}
								{String((vote) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>voter kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									voterKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const voterKind = resolvedEntity.voterKind}
							{#if voterKind !== undefined && voterKind !== null}
								{String((voterKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>voter credential</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									voterCredential: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const voterCredential = resolvedEntity.voterCredential}
							{#if voterCredential !== undefined && voterCredential !== null}
								<TruncatedValue value={String((voterCredential) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$drep}
			>
				{#snippet children(cardanoDRep)}
					{#if cardanoDRep != null && cardanoDRep[EntityMetaKey.Selector] != null}
						<div>
							<dt>drep</dt>
							<dd>
								<CardanoDRepView
									selection={select(EntityType.CardanoDRep, cardanoDRep[EntityMetaKey.Selector])}
									prefetched={cardanoDRep}
									href={
										(
											cardanoDRep[EntityMetaKey.Selector] != null && 'drepCredential' in cardanoDRep[EntityMetaKey.Selector]
											&& cardanoDRep[EntityMetaKey.Selector].drepCredential != null
											&& cardanoDRep[EntityMetaKey.Selector] != null && '$network' in cardanoDRep[EntityMetaKey.Selector] ?
												cardanoDRep[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoDRep[EntityMetaKey.Selector].$network
												&& cardanoDRep[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
												drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
												network: String(caip2StringFromValue(cardanoDRep[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoDRep[EntityMetaKey.Selector].$network != null && 'slug' in cardanoDRep[EntityMetaKey.Selector].$network
													&& cardanoDRep[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
													drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
													network: String(cardanoDRep[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
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
					{#if cardanoStakePool != null && cardanoStakePool[EntityMetaKey.Selector] != null}
						<div>
							<dt>stake pool</dt>
							<dd>
								<CardanoStakePoolView
									selection={select(EntityType.CardanoStakePool, cardanoStakePool[EntityMetaKey.Selector])}
									prefetched={cardanoStakePool}
									href={
										(
											cardanoStakePool[EntityMetaKey.Selector] != null && 'poolId' in cardanoStakePool[EntityMetaKey.Selector]
											&& cardanoStakePool[EntityMetaKey.Selector].poolId != null
											&& cardanoStakePool[EntityMetaKey.Selector] != null && '$network' in cardanoStakePool[EntityMetaKey.Selector] ?
												cardanoStakePool[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoStakePool[EntityMetaKey.Selector].$network
												&& cardanoStakePool[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
												poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
												network: String(caip2StringFromValue(cardanoStakePool[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoStakePool[EntityMetaKey.Selector].$network != null && 'slug' in cardanoStakePool[EntityMetaKey.Selector].$network
													&& cardanoStakePool[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
													poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
													network: String(cardanoStakePool[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
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
					{#if cardanoTransaction != null && cardanoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<CardanoTransactionView
									selection={select(EntityType.CardanoTransaction, cardanoTransaction[EntityMetaKey.Selector])}
									prefetched={cardanoTransaction}
									href={
										(
											cardanoTransaction[EntityMetaKey.Selector] != null && 'hash' in cardanoTransaction[EntityMetaKey.Selector]
											&& cardanoTransaction[EntityMetaKey.Selector].hash != null
											&& cardanoTransaction[EntityMetaKey.Selector] != null && '$network' in cardanoTransaction[EntityMetaKey.Selector] ?
												cardanoTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoTransaction[EntityMetaKey.Selector].$network
												&& cardanoTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
												transactionId: String(cardanoTransaction[EntityMetaKey.Selector].hash ?? ''),
												network: String(caip2StringFromValue(cardanoTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoTransaction[EntityMetaKey.Selector].$network != null && 'slug' in cardanoTransaction[EntityMetaKey.Selector].$network
													&& cardanoTransaction[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
													transactionId: String(cardanoTransaction[EntityMetaKey.Selector].hash ?? ''),
													network: String(cardanoTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>vote transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									voteTxHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const voteTxHash = resolvedEntity.voteTxHash}
							{#if voteTxHash !== undefined && voteTxHash !== null}
								<TruncatedValue value={String((voteTxHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							voteIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const voteIndex = resolvedEntity.voteIndex}
					{#if voteIndex !== undefined && voteIndex !== null}
						<div>
							<dt>vote index</dt>
							<dd>
								{String((voteIndex) ?? '')}
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
						sources: selection.sources,
						fields: {
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorUrl = resolvedEntity.anchorUrl}
					{#if anchorUrl !== undefined && anchorUrl !== null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							anchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorHash = resolvedEntity.anchorHash}
					{#if anchorHash !== undefined && anchorHash !== null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={String((anchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epoch = resolvedEntity.epoch}
					{#if epoch !== undefined && epoch !== null}
						<div>
							<dt>epoch</dt>
							<dd>
								{String((epoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
