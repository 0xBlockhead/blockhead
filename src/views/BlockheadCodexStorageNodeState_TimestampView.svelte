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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCodexStorageNodeState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCodexStorageNodeState_Timestamp>>
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
	const blockheadCodexStorageNodeStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			version: true,
			peerCount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead codex storage node state timestamp')
	const viewDomId = $derived('blockhead-codex-storage-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCodexStorageNodeStateView from '$/views/BlockheadCodexStorageNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStorageNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.version) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead codex storage node state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStorageNodeStateTimestamp}>
			{#snippet Pending()}
				{@const peerCount0 = prefetched.peerCount}
				{#if peerCount0 !== undefined && peerCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(peerCount0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const peerCount0 = resolvedEntity.peerCount}
				{#if peerCount0 !== undefined && peerCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(peerCount0)} />
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
					<BlockheadCodexStorageNodeStateView
						selection={select(EntityType.BlockheadCodexStorageNodeState, selection.entitySelector.$nodeState)}
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
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revision = prefetched.revision}
					{#if revision !== undefined && revision !== null}
						<div>
							<dt>revision</dt>
							<dd>
								{String((revision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revision = resolvedEntity.revision}
					{#if revision !== undefined && revision !== null}
						<div>
							<dt>revision</dt>
							<dd>
								{String((revision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							repoPath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const repoPath = prefetched.repoPath}
					{#if repoPath !== undefined && repoPath !== null}
						<div>
							<dt>repo path</dt>
							<dd>
								{String((repoPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const repoPath = resolvedEntity.repoPath}
					{#if repoPath !== undefined && repoPath !== null}
						<div>
							<dt>repo path</dt>
							<dd>
								{String((repoPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>listen addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									listenAddresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const listenAddresses = prefetched.listenAddresses}
							{#if listenAddresses !== undefined && listenAddresses !== null}
								<TruncatedValue value={(listenAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const listenAddresses = resolvedEntity.listenAddresses}
							{#if listenAddresses !== undefined && listenAddresses !== null}
								<TruncatedValue value={(listenAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>announce addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									announceAddresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const announceAddresses = prefetched.announceAddresses}
							{#if announceAddresses !== undefined && announceAddresses !== null}
								<TruncatedValue value={(announceAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const announceAddresses = resolvedEntity.announceAddresses}
							{#if announceAddresses !== undefined && announceAddresses !== null}
								<TruncatedValue value={(announceAddresses?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const peerCount = prefetched.peerCount}
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
							totalBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalBlocks = prefetched.totalBlocks}
					{#if totalBlocks !== undefined && totalBlocks !== null}
						<div>
							<dt>total blocks</dt>
							<dd>
								<NumberValue value={Number(totalBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalBlocks = resolvedEntity.totalBlocks}
					{#if totalBlocks !== undefined && totalBlocks !== null}
						<div>
							<dt>total blocks</dt>
							<dd>
								<NumberValue value={Number(totalBlocks)} />
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
							quotaMaxBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quotaMaxBytes = prefetched.quotaMaxBytes}
					{#if quotaMaxBytes !== undefined && quotaMaxBytes !== null}
						<div>
							<dt>quota max bytes</dt>
							<dd>
								<NumberValue value={Number(quotaMaxBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quotaMaxBytes = resolvedEntity.quotaMaxBytes}
					{#if quotaMaxBytes !== undefined && quotaMaxBytes !== null}
						<div>
							<dt>quota max bytes</dt>
							<dd>
								<NumberValue value={Number(quotaMaxBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							quotaUsedBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quotaUsedBytes = prefetched.quotaUsedBytes}
					{#if quotaUsedBytes !== undefined && quotaUsedBytes !== null}
						<div>
							<dt>quota used bytes</dt>
							<dd>
								<NumberValue value={Number(quotaUsedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quotaUsedBytes = resolvedEntity.quotaUsedBytes}
					{#if quotaUsedBytes !== undefined && quotaUsedBytes !== null}
						<div>
							<dt>quota used bytes</dt>
							<dd>
								<NumberValue value={Number(quotaUsedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							quotaReservedBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quotaReservedBytes = prefetched.quotaReservedBytes}
					{#if quotaReservedBytes !== undefined && quotaReservedBytes !== null}
						<div>
							<dt>quota reserved bytes</dt>
							<dd>
								<NumberValue value={Number(quotaReservedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quotaReservedBytes = resolvedEntity.quotaReservedBytes}
					{#if quotaReservedBytes !== undefined && quotaReservedBytes !== null}
						<div>
							<dt>quota reserved bytes</dt>
							<dd>
								<NumberValue value={Number(quotaReservedBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
