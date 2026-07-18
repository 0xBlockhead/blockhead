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
			selection: RegisteredEntityProxyResource<EntityType.CardanoGovernanceProposal_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoGovernanceProposal_Timestamp>>
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
	const cardanoGovernanceProposalTimestamp = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('Cardano governance proposal timestamp')
	const viewDomId = $derived('cardano-governance-proposal-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoGovernanceProposalTimestamp}>
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
				<dt>epoch</dt>
				<dd>
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
								{String((epoch) ?? '')}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							yesStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const yesStakeLovelace = resolvedEntity.yesStakeLovelace}
					{#if yesStakeLovelace !== undefined && yesStakeLovelace !== null}
						<div>
							<dt>yes stake lovelace</dt>
							<dd>
								{String((yesStakeLovelace) ?? '')}
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
							noStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noStakeLovelace = resolvedEntity.noStakeLovelace}
					{#if noStakeLovelace !== undefined && noStakeLovelace !== null}
						<div>
							<dt>no stake lovelace</dt>
							<dd>
								{String((noStakeLovelace) ?? '')}
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
							abstainStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const abstainStakeLovelace = resolvedEntity.abstainStakeLovelace}
					{#if abstainStakeLovelace !== undefined && abstainStakeLovelace !== null}
						<div>
							<dt>abstain stake lovelace</dt>
							<dd>
								{String((abstainStakeLovelace) ?? '')}
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
							drepYesStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const drepYesStakeLovelace = resolvedEntity.drepYesStakeLovelace}
					{#if drepYesStakeLovelace !== undefined && drepYesStakeLovelace !== null}
						<div>
							<dt>drep yes stake lovelace</dt>
							<dd>
								{String((drepYesStakeLovelace) ?? '')}
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
							drepNoStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const drepNoStakeLovelace = resolvedEntity.drepNoStakeLovelace}
					{#if drepNoStakeLovelace !== undefined && drepNoStakeLovelace !== null}
						<div>
							<dt>drep no stake lovelace</dt>
							<dd>
								{String((drepNoStakeLovelace) ?? '')}
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
							spoYesStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spoYesStakeLovelace = resolvedEntity.spoYesStakeLovelace}
					{#if spoYesStakeLovelace !== undefined && spoYesStakeLovelace !== null}
						<div>
							<dt>spo yes stake lovelace</dt>
							<dd>
								{String((spoYesStakeLovelace) ?? '')}
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
							spoNoStakeLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spoNoStakeLovelace = resolvedEntity.spoNoStakeLovelace}
					{#if spoNoStakeLovelace !== undefined && spoNoStakeLovelace !== null}
						<div>
							<dt>spo no stake lovelace</dt>
							<dd>
								{String((spoNoStakeLovelace) ?? '')}
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
							committeeYesCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const committeeYesCount = resolvedEntity.committeeYesCount}
					{#if committeeYesCount !== undefined && committeeYesCount !== null}
						<div>
							<dt>committee yes count</dt>
							<dd>
								{String((committeeYesCount) ?? '')}
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
							committeeNoCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const committeeNoCount = resolvedEntity.committeeNoCount}
					{#if committeeNoCount !== undefined && committeeNoCount !== null}
						<div>
							<dt>committee no count</dt>
							<dd>
								{String((committeeNoCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
