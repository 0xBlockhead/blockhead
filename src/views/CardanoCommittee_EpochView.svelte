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
			selection: RegisteredEntityProxyResource<EntityType.CardanoCommittee_Epoch>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoCommittee_Epoch>
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
	const cardanoCommitteeEpoch = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			memberCount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			memberCount: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.epoch) ?? '') ? 'Epoch ' + String((pendingEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano committee epoch')
	const viewDomId = $derived('cardano-committee-epoch-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoCommittee_Epoch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'epoch' in selection.entitySelector
			&& selection.entitySelector.epoch != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
				epoch: String(selection.entitySelector.epoch ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
					epoch: String(selection.entitySelector.epoch ?? ''),
					source: String(selection.entitySelector.source ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'memberCount')}
			{[(String((pendingEntity.epoch) ?? '') ? 'Epoch ' + String((pendingEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoCommitteeEpoch}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[(String((resolvedEntity.epoch) ?? '') ? 'Epoch ' + String((resolvedEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'memberCount')}
			{[String((pendingEntity.memberCount) ?? '')].filter(Boolean).join(' ') || [(String((pendingEntity.epoch) ?? '') ? 'Epoch ' + String((pendingEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoCommitteeEpoch}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.memberCount) ?? '')].filter(Boolean).join(' ') || [(String((resolvedEntity.epoch) ?? '') ? 'Epoch ' + String((resolvedEntity.epoch) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
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

			<div>
				<dt>dissolved</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									dissolved: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dissolved = resolvedEntity.dissolved}
							{#if dissolved !== undefined && dissolved !== null}
								{dissolved ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							govActionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const govActionId = resolvedEntity.govActionId}
					{#if govActionId !== undefined && govActionId !== null}
						<div>
							<dt>governance action ID</dt>
							<dd>
								{String((govActionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection
						.$seatingProposal({
							sources: [
								Source.Blockfrost_Rest,
							],
						})
				}
			>
				{#snippet children(cardanoGovernanceProposal)}
					{#if cardanoGovernanceProposal != null && cardanoGovernanceProposal[EntityMetaKey.Selector] != null}
						<div>
							<dt>seating proposal</dt>
							<dd>
								<CardanoGovernanceProposalView
									selection={select(EntityType.CardanoGovernanceProposal, cardanoGovernanceProposal[EntityMetaKey.Selector])}
									prefetched={cardanoGovernanceProposal}
									href={
										(
											cardanoGovernanceProposal[EntityMetaKey.Selector] != null && 'proposalTxHash' in cardanoGovernanceProposal[EntityMetaKey.Selector]
											&& cardanoGovernanceProposal[EntityMetaKey.Selector].proposalTxHash != null
											&& cardanoGovernanceProposal[EntityMetaKey.Selector] != null && 'proposalIndex' in cardanoGovernanceProposal[EntityMetaKey.Selector]
											&& cardanoGovernanceProposal[EntityMetaKey.Selector].proposalIndex != null
											&& cardanoGovernanceProposal[EntityMetaKey.Selector] != null && '$network' in cardanoGovernanceProposal[EntityMetaKey.Selector] ?
												cardanoGovernanceProposal[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoGovernanceProposal[EntityMetaKey.Selector].$network
												&& cardanoGovernanceProposal[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
												proposalTxHash: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalTxHash ?? ''),
												proposalIndex: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalIndex ?? ''),
												network: String(caip2StringFromValue(cardanoGovernanceProposal[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoGovernanceProposal[EntityMetaKey.Selector].$network != null && 'slug' in cardanoGovernanceProposal[EntityMetaKey.Selector].$network
													&& cardanoGovernanceProposal[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
													proposalTxHash: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalTxHash ?? ''),
													proposalIndex: String(cardanoGovernanceProposal[EntityMetaKey.Selector].proposalIndex ?? ''),
													network: String(cardanoGovernanceProposal[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quorumNumerator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quorumNumerator = resolvedEntity.quorumNumerator}
					{#if quorumNumerator !== undefined && quorumNumerator !== null}
						<div>
							<dt>quorum numerator</dt>
							<dd>
								{String((quorumNumerator) ?? '')}
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
							quorumDenominator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quorumDenominator = resolvedEntity.quorumDenominator}
					{#if quorumDenominator !== undefined && quorumDenominator !== null}
						<div>
							<dt>quorum denominator</dt>
							<dd>
								{String((quorumDenominator) ?? '')}
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
							memberCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memberCount = resolvedEntity.memberCount}
					{#if memberCount !== undefined && memberCount !== null}
						<div>
							<dt>member count</dt>
							<dd>
								{String((memberCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource = selection
		.$$votes({
			sources: [
				Source.Blockfrost_Rest,
			],
		})}
				<ResourceBoundary
					resource={cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<CardanoGovernanceVotesView
							selection={cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource}
							countResource={cardanoCommitteeEpochCardanoGovernanceVotesViewVotesResource.count}
							title='votes'
							id='CardanoGovernanceVotesView-votes'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
