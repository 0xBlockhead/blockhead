<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.CardanoGovernanceVote>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoGovernanceVote>>
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
	const cardanoGovernanceVote = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('Cardano governance vote')
	const viewDomId = $derived('cardano-governance-vote-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceVote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
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
						selection={select(EntityType.CardanoGovernanceProposal, selection.entitySelector.$proposal, {})}
						href={
							(selection.entitySelector.$proposal.proposalTxHash !== undefined && selection.entitySelector.$proposal.proposalIndex !== undefined && selection.entitySelector.$proposal.$network !== undefined && selection.entitySelector.$proposal.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
								proposalTxHash: String(selection.entitySelector.$proposal.proposalTxHash ?? ''),
								proposalIndex: String(selection.entitySelector.$proposal.proposalIndex ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$proposal.$network.caip2) ?? ''),
							}) : selection.entitySelector.$proposal.proposalTxHash !== undefined && selection.entitySelector.$proposal.proposalIndex !== undefined && selection.entitySelector.$proposal.$network !== undefined && selection.entitySelector.$proposal.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
								proposalTxHash: String(selection.entitySelector.$proposal.proposalTxHash ?? ''),
								proposalIndex: String(selection.entitySelector.$proposal.proposalIndex ?? ''),
								network: String(selection.entitySelector.$proposal.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
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
										(cardanoDRep[EntityMetaKey.Selector].drepCredential !== undefined && cardanoDRep[EntityMetaKey.Selector].$network !== undefined && cardanoDRep[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
											drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
											network: String(caip2StringFromValue(cardanoDRep[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : cardanoDRep[EntityMetaKey.Selector].drepCredential !== undefined && cardanoDRep[EntityMetaKey.Selector].$network !== undefined && cardanoDRep[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
											drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
											network: String(cardanoDRep[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
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
										(cardanoStakePool[EntityMetaKey.Selector].poolId !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
											poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
											network: String(caip2StringFromValue(cardanoStakePool[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : cardanoStakePool[EntityMetaKey.Selector].poolId !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network !== undefined && cardanoStakePool[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
											poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
											network: String(cardanoStakePool[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
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
