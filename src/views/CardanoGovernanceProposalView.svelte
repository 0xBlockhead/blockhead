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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.CardanoGovernanceProposal>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoGovernanceProposal>
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
	const cardanoGovernanceProposal = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			proposalKind: true,
			governanceActionId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			proposalKind: true,
			governanceActionId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.proposalKind) ?? ''), String((pendingEntity.governanceActionId) ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal')
	const viewDomId = $derived('cardano-governance-proposal-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoGovernanceProposal_TimestampsView from '$/views/CardanoGovernanceProposal_TimestampsView.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceProposal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'proposalTxHash' in selection.entitySelector
			&& selection.entitySelector.proposalTxHash != null
			&& selection.entitySelector != null && 'proposalIndex' in selection.entitySelector
			&& selection.entitySelector.proposalIndex != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
				proposalTxHash: String(selection.entitySelector.proposalTxHash ?? ''),
				proposalIndex: String(selection.entitySelector.proposalIndex ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
					proposalTxHash: String(selection.entitySelector.proposalTxHash ?? ''),
					proposalIndex: String(selection.entitySelector.proposalIndex ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'proposalKind') && Object.hasOwn(prefetched, 'governanceActionId')}
			{[String((pendingEntity.proposalKind) ?? ''), String((pendingEntity.governanceActionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.proposalKind) ?? ''), String((resolvedEntity.governanceActionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'proposalKind') && Object.hasOwn(prefetched, 'governanceActionId')}
			{[(String((pendingEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((pendingEntity.proposalTxHash) ?? '') : ''), (String((pendingEntity.proposalIndex) ?? '') ? '#' + String((pendingEntity.proposalIndex) ?? '') : '')].filter(Boolean).join(' ') || [String((pendingEntity.proposalKind) ?? ''), String((pendingEntity.governanceActionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[(String((resolvedEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((resolvedEntity.proposalTxHash) ?? '') : ''), (String((resolvedEntity.proposalIndex) ?? '') ? '#' + String((resolvedEntity.proposalIndex) ?? '') : '')].filter(Boolean).join(' ') || [String((resolvedEntity.proposalKind) ?? ''), String((resolvedEntity.governanceActionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection
						.$transaction({
							sources: [
								Source.CardanoKoios_Rest,
							],
						})
				}
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
				<dt>proposal kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									proposalKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const proposalKind = resolvedEntity.proposalKind}
							{#if proposalKind !== undefined && proposalKind !== null}
								{String((proposalKind) ?? '')}
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
							governanceActionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const governanceActionId = resolvedEntity.governanceActionId}
					{#if governanceActionId !== undefined && governanceActionId !== null}
						<div>
							<dt>governance action ID</dt>
							<dd>
								{String((governanceActionId) ?? '')}
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
							depositLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const depositLovelace = resolvedEntity.depositLovelace}
					{#if depositLovelace !== undefined && depositLovelace !== null}
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
						sources: selection.sources,
						fields: {
							returnAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const returnAddress = resolvedEntity.returnAddress}
					{#if returnAddress !== undefined && returnAddress !== null}
						<div>
							<dt>return address</dt>
							<dd>
								<TruncatedValue value={String((returnAddress) ?? '')} />
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
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						proposalPayload: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const proposalPayload = resolvedEntity.proposalPayload}
				{#if proposalPayload !== undefined && proposalPayload !== null && proposalPayload !== ''}
					<code>{proposalPayload == null ? '' : String((JSON.stringify((proposalPayload), null, 2)) ?? '')}</code>
				{:else}
					<p data-text="muted">No proposal payload available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource = selection
		.$$timestamps({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
				<ResourceBoundary
					resource={cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<CardanoGovernanceProposal_TimestampsView
							selection={cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource}
							countResource={cardanoGovernanceProposalCardanoGovernanceProposalTimestampsViewTimestampsResource.count}
							title='timestamps'
							id='CardanoGovernanceProposal_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource = selection
		.$$votes({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
				<ResourceBoundary
					resource={cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<CardanoGovernanceVotesView
							selection={cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource}
							countResource={cardanoGovernanceProposalCardanoGovernanceVotesViewVotesResource.count}
							title='votes'
							id='CardanoGovernanceVotesView-votes'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
