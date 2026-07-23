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
			selection: RegisteredEntityProxyResource<EntityType.CardanoGovernanceProposal_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoGovernanceProposal_Timestamp>
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
	const cardanoGovernanceProposalTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			status: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.epoch) ?? '') ? 'Epoch ' + String((pendingEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano governance proposal timestamp')
	const viewDomId = $derived('cardano-governance-proposal-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{[(String((pendingEntity.epoch) ?? '') ? 'Epoch ' + String((pendingEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposalTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[(String((resolvedEntity.epoch) ?? '') ? 'Epoch ' + String((resolvedEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [(String((pendingEntity.epoch) ?? '') ? 'Epoch ' + String((pendingEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposalTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [(String((resolvedEntity.epoch) ?? '') ? 'Epoch ' + String((resolvedEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposalTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
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
							ratifiedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ratifiedEpoch = resolvedEntity.ratifiedEpoch}
					{#if ratifiedEpoch !== undefined && ratifiedEpoch !== null}
						<div>
							<dt>ratified epoch</dt>
							<dd>
								{String((ratifiedEpoch) ?? '')}
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
							enactedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enactedEpoch = resolvedEntity.enactedEpoch}
					{#if enactedEpoch !== undefined && enactedEpoch !== null}
						<div>
							<dt>enacted epoch</dt>
							<dd>
								{String((enactedEpoch) ?? '')}
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
							droppedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const droppedEpoch = resolvedEntity.droppedEpoch}
					{#if droppedEpoch !== undefined && droppedEpoch !== null}
						<div>
							<dt>dropped epoch</dt>
							<dd>
								{String((droppedEpoch) ?? '')}
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
							expiredEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiredEpoch = resolvedEntity.expiredEpoch}
					{#if expiredEpoch !== undefined && expiredEpoch !== null}
						<div>
							<dt>expired epoch</dt>
							<dd>
								{String((expiredEpoch) ?? '')}
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
							expirationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationEpoch = resolvedEntity.expirationEpoch}
					{#if expirationEpoch !== undefined && expirationEpoch !== null}
						<div>
							<dt>expiration epoch</dt>
							<dd>
								{String((expirationEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
