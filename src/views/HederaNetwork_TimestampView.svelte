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
			selection: RegisteredEntityProxyResource<EntityType.HederaNetwork_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HederaNetwork_Timestamp>>
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
	const hederaNetworkTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera network timestamp')
	const viewDomId = $derived('hedera-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'hedera network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
							latestConsensusTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestConsensusTimestamp = pendingEntity.latestConsensusTimestamp}
					{#if latestConsensusTimestamp !== undefined && latestConsensusTimestamp !== null}
						<div>
							<dt>latest consensus timestamp</dt>
							<dd>
								{String((latestConsensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestConsensusTimestamp = resolvedEntity.latestConsensusTimestamp}
					{#if latestConsensusTimestamp !== undefined && latestConsensusTimestamp !== null}
						<div>
							<dt>latest consensus timestamp</dt>
							<dd>
								{String((latestConsensusTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockNumber = pendingEntity.latestBlockNumber}
					{#if latestBlockNumber !== undefined && latestBlockNumber !== null}
						<div>
							<dt>latest block number</dt>
							<dd>
								{String((latestBlockNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockNumber = resolvedEntity.latestBlockNumber}
					{#if latestBlockNumber !== undefined && latestBlockNumber !== null}
						<div>
							<dt>latest block number</dt>
							<dd>
								{String((latestBlockNumber) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestTransactionCount = pendingEntity.latestTransactionCount}
					{#if latestTransactionCount !== undefined && latestTransactionCount !== null}
						<div>
							<dt>latest transaction count</dt>
							<dd>
								{String((latestTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestTransactionCount = resolvedEntity.latestTransactionCount}
					{#if latestTransactionCount !== undefined && latestTransactionCount !== null}
						<div>
							<dt>latest transaction count</dt>
							<dd>
								{String((latestTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountCount = pendingEntity.accountCount}
					{#if accountCount !== undefined && accountCount !== null}
						<div>
							<dt>account count</dt>
							<dd>
								<TruncatedValue value={String((accountCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountCount = resolvedEntity.accountCount}
					{#if accountCount !== undefined && accountCount !== null}
						<div>
							<dt>account count</dt>
							<dd>
								<TruncatedValue value={String((accountCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenCount = pendingEntity.tokenCount}
					{#if tokenCount !== undefined && tokenCount !== null}
						<div>
							<dt>token count</dt>
							<dd>
								{String((tokenCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenCount = resolvedEntity.tokenCount}
					{#if tokenCount !== undefined && tokenCount !== null}
						<div>
							<dt>token count</dt>
							<dd>
								{String((tokenCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							topicCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const topicCount = pendingEntity.topicCount}
					{#if topicCount !== undefined && topicCount !== null}
						<div>
							<dt>topic count</dt>
							<dd>
								{String((topicCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const topicCount = resolvedEntity.topicCount}
					{#if topicCount !== undefined && topicCount !== null}
						<div>
							<dt>topic count</dt>
							<dd>
								{String((topicCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contractCount = pendingEntity.contractCount}
					{#if contractCount !== undefined && contractCount !== null}
						<div>
							<dt>contract count</dt>
							<dd>
								{String((contractCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contractCount = resolvedEntity.contractCount}
					{#if contractCount !== undefined && contractCount !== null}
						<div>
							<dt>contract count</dt>
							<dd>
								{String((contractCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mirrorNodeLagMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mirrorNodeLagMs = pendingEntity.mirrorNodeLagMs}
					{#if mirrorNodeLagMs !== undefined && mirrorNodeLagMs !== null}
						<div>
							<dt>mirror node lag ms</dt>
							<dd>
								{String((mirrorNodeLagMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mirrorNodeLagMs = resolvedEntity.mirrorNodeLagMs}
					{#if mirrorNodeLagMs !== undefined && mirrorNodeLagMs !== null}
						<div>
							<dt>mirror node lag ms</dt>
							<dd>
								{String((mirrorNodeLagMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
