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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposal>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosGovernanceProposal>>
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
	const cosmosGovernanceProposal = $derived(selection({
		fields: {
			title: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? ''), (String((pendingEntity.proposalId) ?? '') ? 'Proposal ' + String((pendingEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || 'Cosmos governance proposal')
	const viewDomId = $derived('cosmos-governance-proposal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosGovernanceProposal_TimestampsView from '$/views/CosmosGovernanceProposal_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosGovernanceProposal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosGovernanceProposal}>
			{#snippet Pending()}
				{[String((pendingEntity.title) ?? ''), (String((pendingEntity.proposalId) ?? '') ? 'Proposal ' + String((pendingEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? ''), (String((resolvedEntity.proposalId) ?? '') ? 'Proposal ' + String((resolvedEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosGovernanceProposal}>
			{#snippet Pending()}
				{[(String((pendingEntity.proposalId) ?? '') ? 'Proposal ' + String((pendingEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || [String((pendingEntity.title) ?? ''), (String((pendingEntity.proposalId) ?? '') ? 'Proposal ' + String((pendingEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || title || 'Cosmos governance proposal'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.proposalId) ?? '') ? 'Proposal ' + String((resolvedEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || [String((resolvedEntity.title) ?? ''), (String((resolvedEntity.proposalId) ?? '') ? 'Proposal ' + String((resolvedEntity.proposalId) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosGovernanceProposal}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Proposal ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									proposalId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const proposalId = pendingEntity.proposalId}
							{#if proposalId !== undefined && proposalId !== null}
								{String((proposalId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const proposalId = resolvedEntity.proposalId}
							{#if proposalId !== undefined && proposalId !== null}
								{String((proposalId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const title = pendingEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>Title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>Title</dt>
							<dd>
								{String((title) ?? '')}
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
					{@const metadata = pendingEntity.metadata}
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
				<dt>Network</dt>
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
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						summary: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const summary = resolvedEntity.summary}
				{#if summary !== undefined && summary !== null && summary !== ''}
					{String((summary) ?? '')}
				{:else}
					<p data-text="muted">No proposal summary available.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CosmosGovernanceProposal_TimestampsView
				selection={selection.$$timestamps}
				title='Lifecycle snapshots'
				emptyText='No Cosmos governance proposal observations.'
				id='CosmosGovernanceProposal_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
