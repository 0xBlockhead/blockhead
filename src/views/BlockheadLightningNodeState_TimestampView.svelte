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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningNodeState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningNodeState_Timestamp>>
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
	const blockheadLightningNodeStateTimestamp = $derived(selection({
		sources: [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
		fields: {
			syncedToChain: true,
			syncedToGraph: true,
			blockHeight: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state timestamp')
	const viewDomId = $derived('blockhead-lightning-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningNodeStateTimestamp}>
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
		<ResourceBoundary resource={blockheadLightningNodeStateTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.syncedToChain) ?? ''), String((pendingEntity.syncedToGraph) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Lightning node state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.syncedToChain) ?? ''), String((resolvedEntity.syncedToGraph) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningNodeStateTimestamp}>
			{#snippet Pending()}
				{@const blockHeight0 = pendingEntity.blockHeight}
				{#if blockHeight0 !== undefined && blockHeight0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(blockHeight0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const blockHeight0 = resolvedEntity.blockHeight}
				{#if blockHeight0 !== undefined && blockHeight0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(blockHeight0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>local node state</dt>
				<dd>
					<BlockheadLightningNodeStateView
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState, {})}
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
							syncedToChain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const syncedToChain = pendingEntity.syncedToChain}
					{#if syncedToChain !== undefined && syncedToChain !== null}
						<div>
							<dt>synced to chain</dt>
							<dd>
								{syncedToChain ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const syncedToChain = resolvedEntity.syncedToChain}
					{#if syncedToChain !== undefined && syncedToChain !== null}
						<div>
							<dt>synced to chain</dt>
							<dd>
								{syncedToChain ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							syncedToGraph: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const syncedToGraph = pendingEntity.syncedToGraph}
					{#if syncedToGraph !== undefined && syncedToGraph !== null}
						<div>
							<dt>synced to graph</dt>
							<dd>
								{syncedToGraph ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const syncedToGraph = resolvedEntity.syncedToGraph}
					{#if syncedToGraph !== undefined && syncedToGraph !== null}
						<div>
							<dt>synced to graph</dt>
							<dd>
								{syncedToGraph ? 'Yes' : 'No'}
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
							blockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockHeight = pendingEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue value={Number(blockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHeight = resolvedEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue value={Number(blockHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bestHeaderTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bestHeaderTimestampMs = pendingEntity.bestHeaderTimestampMs}
					{#if bestHeaderTimestampMs !== undefined && bestHeaderTimestampMs !== null}
						<div>
							<dt>best header timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(bestHeaderTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bestHeaderTimestampMs = resolvedEntity.bestHeaderTimestampMs}
					{#if bestHeaderTimestampMs !== undefined && bestHeaderTimestampMs !== null}
						<div>
							<dt>best header timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(bestHeaderTimestampMs)} />
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
							walletBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const walletBalanceSats = pendingEntity.walletBalanceSats}
					{#if walletBalanceSats !== undefined && walletBalanceSats !== null}
						<div>
							<dt>wallet balance sats</dt>
							<dd>
								<NumberValue value={Number(walletBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const walletBalanceSats = resolvedEntity.walletBalanceSats}
					{#if walletBalanceSats !== undefined && walletBalanceSats !== null}
						<div>
							<dt>wallet balance sats</dt>
							<dd>
								<NumberValue value={Number(walletBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							channelBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const channelBalanceSats = pendingEntity.channelBalanceSats}
					{#if channelBalanceSats !== undefined && channelBalanceSats !== null}
						<div>
							<dt>channel balance sats</dt>
							<dd>
								<NumberValue value={Number(channelBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const channelBalanceSats = resolvedEntity.channelBalanceSats}
					{#if channelBalanceSats !== undefined && channelBalanceSats !== null}
						<div>
							<dt>channel balance sats</dt>
							<dd>
								<NumberValue value={Number(channelBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pendingChannelBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pendingChannelBalanceSats = pendingEntity.pendingChannelBalanceSats}
					{#if pendingChannelBalanceSats !== undefined && pendingChannelBalanceSats !== null}
						<div>
							<dt>pending channel balance sats</dt>
							<dd>
								<NumberValue value={Number(pendingChannelBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingChannelBalanceSats = resolvedEntity.pendingChannelBalanceSats}
					{#if pendingChannelBalanceSats !== undefined && pendingChannelBalanceSats !== null}
						<div>
							<dt>pending channel balance sats</dt>
							<dd>
								<NumberValue value={Number(pendingChannelBalanceSats)} />
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
							activeChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activeChannelCount = pendingEntity.activeChannelCount}
					{#if activeChannelCount !== undefined && activeChannelCount !== null}
						<div>
							<dt>active channel count</dt>
							<dd>
								<NumberValue value={Number(activeChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeChannelCount = resolvedEntity.activeChannelCount}
					{#if activeChannelCount !== undefined && activeChannelCount !== null}
						<div>
							<dt>active channel count</dt>
							<dd>
								<NumberValue value={Number(activeChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							inactiveChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inactiveChannelCount = pendingEntity.inactiveChannelCount}
					{#if inactiveChannelCount !== undefined && inactiveChannelCount !== null}
						<div>
							<dt>inactive channel count</dt>
							<dd>
								<NumberValue value={Number(inactiveChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inactiveChannelCount = resolvedEntity.inactiveChannelCount}
					{#if inactiveChannelCount !== undefined && inactiveChannelCount !== null}
						<div>
							<dt>inactive channel count</dt>
							<dd>
								<NumberValue value={Number(inactiveChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pendingChannelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pendingChannelCount = pendingEntity.pendingChannelCount}
					{#if pendingChannelCount !== undefined && pendingChannelCount !== null}
						<div>
							<dt>pending channel count</dt>
							<dd>
								<NumberValue value={Number(pendingChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingChannelCount = resolvedEntity.pendingChannelCount}
					{#if pendingChannelCount !== undefined && pendingChannelCount !== null}
						<div>
							<dt>pending channel count</dt>
							<dd>
								<NumberValue value={Number(pendingChannelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
