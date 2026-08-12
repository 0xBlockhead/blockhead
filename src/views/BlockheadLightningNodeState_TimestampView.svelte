<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLightningNodeState_Timestamp>, 'prefetched'> = $props()

	const localNodeState = $derived(selection.entitySelector.$localNodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
	}))
	const blockheadLightningNodeStateTimestamp = $derived(viewSelection({
		fields: {
			syncedToChain: true,
			syncedToGraph: true,
			blockHeight: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in localNodeState.$network.$network ?
							caip2StringFromValue(localNodeState.$network.$network.caip2)
						:
							localNodeState.$network.$network.slug
					),
					connectionId: localNodeState.connectionId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningNodeStateTimestamp}>
			{#snippet children(entity)}
				{[String(entity.syncedToChain ?? ''), String(entity.syncedToGraph ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const blockHeight = entity.blockHeight}
				{#if blockHeight != null}
					<span data-text="muted">
						<NumberValue
							value={blockHeight}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>local LND node state</dt>
				<dd>
					<BlockheadLightningNodeStateView
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nodeVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeVersion = entity.nodeVersion}
					{#if nodeVersion != null}
						<div>
							<dt>LND version</dt>
							<dd>
								{nodeVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadLightningNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const syncedToChain = entity.syncedToChain}
					{#if syncedToChain != null}
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
				resource={blockheadLightningNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const syncedToGraph = entity.syncedToGraph}
					{#if syncedToGraph != null}
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
				resource={blockheadLightningNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue
									value={blockHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bestHeaderTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bestHeaderTimestampMs = entity.bestHeaderTimestampMs}
					{#if bestHeaderTimestampMs != null}
						<div>
							<dt>best header timestamp ms</dt>
							<dd>
								<Timestamp timestamp={bestHeaderTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							walletBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const walletBalanceSats = entity.walletBalanceSats}
					{#if walletBalanceSats != null}
						<div>
							<dt>Local LND wallet balance sats</dt>
							<dd>
								<NumberValue
									value={walletBalanceSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							channelBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const channelBalanceSats = entity.channelBalanceSats}
					{#if channelBalanceSats != null}
						<div>
							<dt>Local LND channel balance sats</dt>
							<dd>
								<NumberValue
									value={channelBalanceSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pendingChannelBalanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingChannelBalanceSats = entity.pendingChannelBalanceSats}
					{#if pendingChannelBalanceSats != null}
						<div>
							<dt>Local LND pending channel balance sats</dt>
							<dd>
								<NumberValue
									value={pendingChannelBalanceSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							peerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue
									value={peerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							activeChannelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeChannelCount = entity.activeChannelCount}
					{#if activeChannelCount != null}
						<div>
							<dt>active channel count</dt>
							<dd>
								<NumberValue
									value={activeChannelCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inactiveChannelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inactiveChannelCount = entity.inactiveChannelCount}
					{#if inactiveChannelCount != null}
						<div>
							<dt>inactive channel count</dt>
							<dd>
								<NumberValue
									value={inactiveChannelCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pendingChannelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingChannelCount = entity.pendingChannelCount}
					{#if pendingChannelCount != null}
						<div>
							<dt>pending channel count</dt>
							<dd>
								<NumberValue
									value={pendingChannelCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
