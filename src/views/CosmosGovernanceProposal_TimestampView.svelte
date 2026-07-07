<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposal_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosGovernanceProposal_Timestamp>>
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
	const cosmosGovernanceProposalTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.status) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'Cosmos governance proposal timestamp')
	const viewDomId = $derived('cosmos-governance-proposal-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$proposal !== undefined && pendingEntity.$proposal.$network !== undefined && pendingEntity.$proposal.$network.caip2 !== undefined && pendingEntity.$proposal.$network.caip2.namespace !== undefined && pendingEntity.$proposal !== undefined && pendingEntity.$proposal.$network !== undefined && pendingEntity.$proposal.$network.caip2 !== undefined && pendingEntity.$proposal.$network.caip2.reference !== undefined && pendingEntity.$proposal !== undefined && pendingEntity.$proposal.proposalId !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$proposal.$network.caip2.namespace ?? '')}:${String(pendingEntity.$proposal.$network.caip2.reference ?? '')}`,
			proposalId: String(pendingEntity.$proposal.proposalId ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((prefetched.status) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.status) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
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
						fields: {
							submitTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const submitTimeMs = prefetched.submitTimeMs}
					{#if submitTimeMs !== undefined && submitTimeMs !== null}
						<div>
							<dt>Submit time</dt>
							<dd>
								{String((submitTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const submitTimeMs = resolvedEntity.submitTimeMs}
					{#if submitTimeMs !== undefined && submitTimeMs !== null}
						<div>
							<dt>Submit time</dt>
							<dd>
								{String((submitTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							depositEndTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const depositEndTimeMs = prefetched.depositEndTimeMs}
					{#if depositEndTimeMs !== undefined && depositEndTimeMs !== null}
						<div>
							<dt>Deposit end time</dt>
							<dd>
								{String((depositEndTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const depositEndTimeMs = resolvedEntity.depositEndTimeMs}
					{#if depositEndTimeMs !== undefined && depositEndTimeMs !== null}
						<div>
							<dt>Deposit end time</dt>
							<dd>
								{String((depositEndTimeMs) ?? '')}
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
							votingStartTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const votingStartTimeMs = prefetched.votingStartTimeMs}
					{#if votingStartTimeMs !== undefined && votingStartTimeMs !== null}
						<div>
							<dt>Voting start time</dt>
							<dd>
								{String((votingStartTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const votingStartTimeMs = resolvedEntity.votingStartTimeMs}
					{#if votingStartTimeMs !== undefined && votingStartTimeMs !== null}
						<div>
							<dt>Voting start time</dt>
							<dd>
								{String((votingStartTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							votingEndTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const votingEndTimeMs = prefetched.votingEndTimeMs}
					{#if votingEndTimeMs !== undefined && votingEndTimeMs !== null}
						<div>
							<dt>Voting end time</dt>
							<dd>
								{String((votingEndTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const votingEndTimeMs = resolvedEntity.votingEndTimeMs}
					{#if votingEndTimeMs !== undefined && votingEndTimeMs !== null}
						<div>
							<dt>Voting end time</dt>
							<dd>
								{String((votingEndTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadata: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metadata = prefetched.metadata}
					{#if metadata !== undefined && metadata !== null}
						<div>
							<dt>Metadata</dt>
							<dd>
								{String((metadata) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadata = resolvedEntity.metadata}
					{#if metadata !== undefined && metadata !== null}
						<div>
							<dt>Metadata</dt>
							<dd>
								{String((metadata) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Proposal</dt>
				<dd>
					<CosmosGovernanceProposalView
						selection={select(EntityType.CosmosGovernanceProposal, selection.entitySelector.$proposal, {})}
						href={
							(selection.entitySelector.$proposal.$network !== undefined && selection.entitySelector.$proposal.$network.caip2 !== undefined && selection.entitySelector.$proposal.$network.caip2.namespace !== undefined && selection.entitySelector.$proposal.$network !== undefined && selection.entitySelector.$proposal.$network.caip2 !== undefined && selection.entitySelector.$proposal.$network.caip2.reference !== undefined && selection.entitySelector.$proposal.proposalId !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]', {
								caip2: `${String(selection.entitySelector.$proposal.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$proposal.$network.caip2.reference ?? '')}`,
								proposalId: String(selection.entitySelector.$proposal.proposalId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
