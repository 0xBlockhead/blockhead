<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const cosmosGovernanceProposalTimestamp = $derived(selection({
		fields: {
			status: true,
			submitTimeMs: true,
			depositEndTimeMs: true,
			votingStartTimeMs: true,
			votingEndTimeMs: true,
			metadata: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'Cosmos governance proposal timestamp')
	const viewDomId = $derived('cosmos-governance-proposal-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$proposal.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$proposal.$network.caip2.reference)}`,
			proposalId: String(({ ...selection.entitySelector, ...prefetched }).$proposal.proposalId),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.status) ?? ''), String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).status) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).status) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.status) ?? '')].filter(Boolean).join(' ') || [String((entity.status) ?? ''), String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = prefetched.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					{String((timestampMs0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = prefetched.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							{String((timestampMs0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = entity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							{String((timestampMs0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{@const submitTimeMs = prefetched.submitTimeMs ?? selection.entitySelector.submitTimeMs}
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
					{@const submitTimeMs = entity.submitTimeMs ?? selection.entitySelector.submitTimeMs ?? prefetched.submitTimeMs}
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

			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{@const depositEndTimeMs = prefetched.depositEndTimeMs ?? selection.entitySelector.depositEndTimeMs}
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
					{@const depositEndTimeMs = entity.depositEndTimeMs ?? selection.entitySelector.depositEndTimeMs ?? prefetched.depositEndTimeMs}
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
			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{@const votingStartTimeMs = prefetched.votingStartTimeMs ?? selection.entitySelector.votingStartTimeMs}
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
					{@const votingStartTimeMs = entity.votingStartTimeMs ?? selection.entitySelector.votingStartTimeMs ?? prefetched.votingStartTimeMs}
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

			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{@const votingEndTimeMs = prefetched.votingEndTimeMs ?? selection.entitySelector.votingEndTimeMs}
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
					{@const votingEndTimeMs = entity.votingEndTimeMs ?? selection.entitySelector.votingEndTimeMs ?? prefetched.votingEndTimeMs}
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

			<ResourceBoundary resource={cosmosGovernanceProposalTimestamp}>
				{#snippet Pending()}
					{@const metadata = prefetched.metadata ?? selection.entitySelector.metadata}
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
					{@const metadata = entity.metadata ?? selection.entitySelector.metadata ?? prefetched.metadata}
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
						selection={select(EntityType.CosmosGovernanceProposal, selection.entitySelector.$proposal)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]', {
								caip2: `${String(selection.entitySelector.$proposal.$network.caip2.namespace)}:${String(selection.entitySelector.$proposal.$network.caip2.reference)}`,
								proposalId: String(selection.entitySelector.$proposal.proposalId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
