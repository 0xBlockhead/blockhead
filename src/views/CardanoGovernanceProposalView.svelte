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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoGovernanceProposal>>
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
	const cardanoGovernanceProposal = $derived(selection({
		sources: selection.sources,
		fields: {
			proposalKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.proposalKind) ?? ''), (String((pendingEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((pendingEntity.proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano governance proposal')
	const viewDomId = $derived('cardano-governance-proposal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.proposalTxHash !== undefined && pendingEntity.proposalIndex !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
			proposalTxHash: String(pendingEntity.proposalTxHash ?? ''),
			proposalIndex: String(pendingEntity.proposalIndex ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.proposalTxHash !== undefined && pendingEntity.proposalIndex !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
			proposalTxHash: String(pendingEntity.proposalTxHash ?? ''),
			proposalIndex: String(pendingEntity.proposalIndex ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.proposalKind) ?? ''), (String((pendingEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((pendingEntity.proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.proposalKind) ?? ''), (String((resolvedEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((resolvedEntity.proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[(String((pendingEntity.proposalIndex) ?? '') ? '#' + String((pendingEntity.proposalIndex) ?? '') : '')].filter(Boolean).join(' ') || [String((pendingEntity.proposalKind) ?? ''), (String((pendingEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((pendingEntity.proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[(String((resolvedEntity.proposalIndex) ?? '') ? '#' + String((resolvedEntity.proposalIndex) ?? '') : '')].filter(Boolean).join(' ') || [String((resolvedEntity.proposalKind) ?? ''), (String((resolvedEntity.proposalTxHash) ?? '') ? 'Proposal ' + String((resolvedEntity.proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection.$transaction({
						sources: [
							Source.Blockfrost_Rest,
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CardanoGovernanceProposal_TimestampsView
				selection={
						selection.$$timestamps({
							sources: [
								Source.Blockfrost_Rest,
							],
							count: true,
						})
					}
				title='timestamps'
				emptyText='No proposal lifecycle observations.'
				id='CardanoGovernanceProposal_TimestampsView-timestamps'
			/>

			<CardanoGovernanceVotesView
				selection={
						selection.$$votes({
							sources: [
								Source.Blockfrost_Rest,
							],
							count: true,
						})
					}
				title='votes'
				emptyText='No votes.'
				id='CardanoGovernanceVotesView-votes'
			/>
		{/if}
	{/snippet}
</EntityView>
