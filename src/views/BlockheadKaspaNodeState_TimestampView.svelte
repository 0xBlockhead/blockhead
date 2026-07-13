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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadKaspaNodeState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadKaspaNodeState_Timestamp>>
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
	const blockheadKaspaNodeStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			isSynced: true,
			hasUtxoIndex: true,
			peerCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead kaspa node state timestamp')
	const viewDomId = $derived('blockhead-kaspa-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadKaspaNodeStateView from '$/views/BlockheadKaspaNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadKaspaNodeStateTimestamp}>
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
		<ResourceBoundary resource={blockheadKaspaNodeStateTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.isSynced) ?? ''), String((pendingEntity.hasUtxoIndex) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead kaspa node state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.isSynced) ?? ''), String((resolvedEntity.hasUtxoIndex) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadKaspaNodeStateTimestamp}>
			{#snippet Pending()}
				{@const peerCount0 = pendingEntity.peerCount}
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
					<BlockheadKaspaNodeStateView
						selection={select(EntityType.BlockheadKaspaNodeState, selection.entitySelector.$nodeState, {})}
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
							serverVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const serverVersion = pendingEntity.serverVersion}
					{#if serverVersion !== undefined && serverVersion !== null}
						<div>
							<dt>server version</dt>
							<dd>
								{String((serverVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serverVersion = resolvedEntity.serverVersion}
					{#if serverVersion !== undefined && serverVersion !== null}
						<div>
							<dt>server version</dt>
							<dd>
								{String((serverVersion) ?? '')}
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
							isSynced: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isSynced = pendingEntity.isSynced}
					{#if isSynced !== undefined && isSynced !== null}
						<div>
							<dt>is synced</dt>
							<dd>
								{isSynced ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isSynced = resolvedEntity.isSynced}
					{#if isSynced !== undefined && isSynced !== null}
						<div>
							<dt>is synced</dt>
							<dd>
								{isSynced ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hasUtxoIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hasUtxoIndex = pendingEntity.hasUtxoIndex}
					{#if hasUtxoIndex !== undefined && hasUtxoIndex !== null}
						<div>
							<dt>has UTXO index</dt>
							<dd>
								{hasUtxoIndex ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hasUtxoIndex = resolvedEntity.hasUtxoIndex}
					{#if hasUtxoIndex !== undefined && hasUtxoIndex !== null}
						<div>
							<dt>has UTXO index</dt>
							<dd>
								{hasUtxoIndex ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							virtualDaaScore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const virtualDaaScore = pendingEntity.virtualDaaScore}
					{#if virtualDaaScore !== undefined && virtualDaaScore !== null}
						<div>
							<dt>virtual daa score</dt>
							<dd>
								<NumberValue value={Number(virtualDaaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualDaaScore = resolvedEntity.virtualDaaScore}
					{#if virtualDaaScore !== undefined && virtualDaaScore !== null}
						<div>
							<dt>virtual daa score</dt>
							<dd>
								<NumberValue value={Number(virtualDaaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							virtualSelectedParentHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const virtualSelectedParentHash = pendingEntity.virtualSelectedParentHash}
					{#if virtualSelectedParentHash !== undefined && virtualSelectedParentHash !== null}
						<div>
							<dt>virtual selected parent hash</dt>
							<dd>
								<TruncatedValue value={String((virtualSelectedParentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualSelectedParentHash = resolvedEntity.virtualSelectedParentHash}
					{#if virtualSelectedParentHash !== undefined && virtualSelectedParentHash !== null}
						<div>
							<dt>virtual selected parent hash</dt>
							<dd>
								<TruncatedValue value={String((virtualSelectedParentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pruningPointHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pruningPointHash = pendingEntity.pruningPointHash}
					{#if pruningPointHash !== undefined && pruningPointHash !== null}
						<div>
							<dt>pruning point hash</dt>
							<dd>
								<TruncatedValue value={String((pruningPointHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pruningPointHash = resolvedEntity.pruningPointHash}
					{#if pruningPointHash !== undefined && pruningPointHash !== null}
						<div>
							<dt>pruning point hash</dt>
							<dd>
								<TruncatedValue value={String((pruningPointHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
