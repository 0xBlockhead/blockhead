<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumNodeState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadQuilibriumNodeState_Timestamp>>
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
	const blockheadQuilibriumNodeStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.QuilibriumNodeMetrics_Prometheus,
			Source.QuilibriumNode_Grpc,
		],
		fields: {
			engineState: true,
			latestFrameNumber: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium node state timestamp')
	const viewDomId = $derived('blockhead-quilibrium-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadQuilibriumNodeStateView from '$/views/BlockheadQuilibriumNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadQuilibriumNodeStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadQuilibriumNodeStateTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.engineState) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead quilibrium node state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.engineState) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumNodeStateTimestamp}>
			{#snippet Pending()}
				{@const latestFrameNumber0 = pendingEntity.latestFrameNumber}
				{#if latestFrameNumber0 !== undefined && latestFrameNumber0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(latestFrameNumber0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const latestFrameNumber0 = resolvedEntity.latestFrameNumber}
				{#if latestFrameNumber0 !== undefined && latestFrameNumber0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(latestFrameNumber0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadQuilibriumNodeStateView
						selection={select(EntityType.BlockheadQuilibriumNodeState, selection.entitySelector.$nodeState, {})}
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
							nodeVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeVersion = pendingEntity.nodeVersion}
					{#if nodeVersion !== undefined && nodeVersion !== null}
						<div>
							<dt>node version</dt>
							<dd>
								{String((nodeVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeVersion = resolvedEntity.nodeVersion}
					{#if nodeVersion !== undefined && nodeVersion !== null}
						<div>
							<dt>node version</dt>
							<dd>
								{String((nodeVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							engineState: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const engineState = pendingEntity.engineState}
					{#if engineState !== undefined && engineState !== null}
						<div>
							<dt>engine state</dt>
							<dd>
								{String((engineState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const engineState = resolvedEntity.engineState}
					{#if engineState !== undefined && engineState !== null}
						<div>
							<dt>engine state</dt>
							<dd>
								{String((engineState) ?? '')}
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
							latestFrameNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestFrameNumber = pendingEntity.latestFrameNumber}
					{#if latestFrameNumber !== undefined && latestFrameNumber !== null}
						<div>
							<dt>latest frame number</dt>
							<dd>
								<NumberValue value={Number(latestFrameNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestFrameNumber = resolvedEntity.latestFrameNumber}
					{#if latestFrameNumber !== undefined && latestFrameNumber !== null}
						<div>
							<dt>latest frame number</dt>
							<dd>
								<NumberValue value={Number(latestFrameNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestFrameHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestFrameHash = pendingEntity.latestFrameHash}
					{#if latestFrameHash !== undefined && latestFrameHash !== null}
						<div>
							<dt>latest frame hash</dt>
							<dd>
								<TruncatedValue value={String((latestFrameHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestFrameHash = resolvedEntity.latestFrameHash}
					{#if latestFrameHash !== undefined && latestFrameHash !== null}
						<div>
							<dt>latest frame hash</dt>
							<dd>
								<TruncatedValue value={String((latestFrameHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const difficulty = pendingEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const difficulty = resolvedEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
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
							peerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerCount = pendingEntity.peerCount}
					{#if peerCount !== undefined && peerCount !== null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue value={Number(peerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerCount = resolvedEntity.peerCount}
					{#if peerCount !== undefined && peerCount !== null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue value={Number(peerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pendingMessageCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pendingMessageCount = pendingEntity.pendingMessageCount}
					{#if pendingMessageCount !== undefined && pendingMessageCount !== null}
						<div>
							<dt>pending message count</dt>
							<dd>
								<NumberValue value={Number(pendingMessageCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingMessageCount = resolvedEntity.pendingMessageCount}
					{#if pendingMessageCount !== undefined && pendingMessageCount !== null}
						<div>
							<dt>pending message count</dt>
							<dd>
								<NumberValue value={Number(pendingMessageCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							frameStoreHead: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const frameStoreHead = pendingEntity.frameStoreHead}
					{#if frameStoreHead !== undefined && frameStoreHead !== null}
						<div>
							<dt>frame store head</dt>
							<dd>
								<NumberValue value={Number(frameStoreHead)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const frameStoreHead = resolvedEntity.frameStoreHead}
					{#if frameStoreHead !== undefined && frameStoreHead !== null}
						<div>
							<dt>frame store head</dt>
							<dd>
								<NumberValue value={Number(frameStoreHead)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = pendingEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
