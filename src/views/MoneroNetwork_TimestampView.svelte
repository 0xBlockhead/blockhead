<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.MoneroNetwork_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))
	const moneroNetworkTimestamp = $derived(viewSelection({
		fields: {
			height: true,
			status: true,
			synchronized: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroNetworkTimestamp}>
			{#snippet children(entity)}
				{@const height = entity.height}
				{#if height != null}
					<NumberValue
						value={height}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroNetworkTimestamp}>
			{#snippet children(entity)}
				{@const status = entity.status}
				{#if status != null}
					<span data-text="muted">
						{status}
					</span>
				{/if}
				{@const synchronized = entity.synchronized}
				{#if synchronized != null}
					<span data-text="muted">
						{synchronized ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
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
				resource={moneroNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const height = entity.height}
					{#if height != null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue
									value={height}
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
							targetHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetHeight = entity.targetHeight}
					{#if targetHeight != null}
						<div>
							<dt>Target height</dt>
							<dd>
								<NumberValue
									value={targetHeight}
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
							topBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const topBlockHash = entity.topBlockHash}
					{#if topBlockHash != null}
						<div>
							<dt>Top block hash</dt>
							<dd>
								<TruncatedValue value={topBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const difficulty = entity.difficulty}
					{#if difficulty != null}
						<div>
							<dt>Difficulty</dt>
							<dd>
								<NumberValue
									value={difficulty}
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
							wideDifficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const wideDifficulty = entity.wideDifficulty}
					{#if wideDifficulty != null}
						<div>
							<dt>Wide difficulty</dt>
							<dd>
								<NumberValue
									value={wideDifficulty}
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
							cumulativeDifficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cumulativeDifficulty = entity.cumulativeDifficulty}
					{#if cumulativeDifficulty != null}
						<div>
							<dt>Cumulative difficulty</dt>
							<dd>
								<NumberValue
									value={cumulativeDifficulty}
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
							wideCumulativeDifficulty: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const wideCumulativeDifficulty = entity.wideCumulativeDifficulty}
					{#if wideCumulativeDifficulty != null}
						<div>
							<dt>Wide cumulative difficulty</dt>
							<dd>
								<NumberValue
									value={wideCumulativeDifficulty}
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
							blockSizeLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockSizeLimit = entity.blockSizeLimit}
					{#if blockSizeLimit != null}
						<div>
							<dt>Block size limit</dt>
							<dd>
								<NumberValue
									value={blockSizeLimit}
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
							blockSizeMedian: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockSizeMedian = entity.blockSizeMedian}
					{#if blockSizeMedian != null}
						<div>
							<dt>Block size median</dt>
							<dd>
								<NumberValue
									value={blockSizeMedian}
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
							blockWeightLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockWeightLimit = entity.blockWeightLimit}
					{#if blockWeightLimit != null}
						<div>
							<dt>Block weight limit</dt>
							<dd>
								<NumberValue
									value={blockWeightLimit}
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
							blockWeightMedian: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockWeightMedian = entity.blockWeightMedian}
					{#if blockWeightMedian != null}
						<div>
							<dt>Block weight median</dt>
							<dd>
								<NumberValue
									value={blockWeightMedian}
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
							databaseSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const databaseSize = entity.databaseSize}
					{#if databaseSize != null}
						<div>
							<dt>Database size</dt>
							<dd>
								<NumberValue
									value={databaseSize}
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
							freeSpace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freeSpace = entity.freeSpace}
					{#if freeSpace != null}
						<div>
							<dt>Free space</dt>
							<dd>
								<NumberValue
									value={freeSpace}
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
							greyPeerlistSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const greyPeerlistSize = entity.greyPeerlistSize}
					{#if greyPeerlistSize != null}
						<div>
							<dt>Grey peerlist size</dt>
							<dd>
								<NumberValue
									value={greyPeerlistSize}
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
							whitePeerlistSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const whitePeerlistSize = entity.whitePeerlistSize}
					{#if whitePeerlistSize != null}
						<div>
							<dt>White peerlist size</dt>
							<dd>
								<NumberValue
									value={whitePeerlistSize}
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
							incomingConnections: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const incomingConnections = entity.incomingConnections}
					{#if incomingConnections != null}
						<div>
							<dt>Incoming connections</dt>
							<dd>
								<NumberValue
									value={incomingConnections}
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
							outgoingConnections: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outgoingConnections = entity.outgoingConnections}
					{#if outgoingConnections != null}
						<div>
							<dt>Outgoing connections</dt>
							<dd>
								<NumberValue
									value={outgoingConnections}
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
							txCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const txCount = entity.txCount}
					{#if txCount != null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								<NumberValue
									value={txCount}
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
							txPoolSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const txPoolSize = entity.txPoolSize}
					{#if txPoolSize != null}
						<div>
							<dt>Transaction pool size</dt>
							<dd>
								<NumberValue
									value={txPoolSize}
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
							altBlocksCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const altBlocksCount = entity.altBlocksCount}
					{#if altBlocksCount != null}
						<div>
							<dt>Alt blocks</dt>
							<dd>
								<NumberValue
									value={altBlocksCount}
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
							targetSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetSeconds = entity.targetSeconds}
					{#if targetSeconds != null}
						<div>
							<dt>Target seconds</dt>
							<dd>
								<NumberValue
									value={targetSeconds}
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
							rpcConnections: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rpcConnections = entity.rpcConnections}
					{#if rpcConnections != null}
						<div>
							<dt>RPC connections</dt>
							<dd>
								<NumberValue
									value={rpcConnections}
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
							mainnet: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mainnet = entity.mainnet}
					{#if mainnet != null}
						<div>
							<dt>Mainnet</dt>
							<dd>
								{mainnet ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nettype: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nettype = entity.nettype}
					{#if nettype != null}
						<div>
							<dt>Network type</dt>
							<dd>
								{nettype}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							offline: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const offline = entity.offline}
					{#if offline != null}
						<div>
							<dt>Offline</dt>
							<dd>
								{offline ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moneroNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const synchronized = entity.synchronized}
					{#if synchronized != null}
						<div>
							<dt>Synchronized</dt>
							<dd>
								{synchronized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							wasBootstrapEverUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const wasBootstrapEverUsed = entity.wasBootstrapEverUsed}
					{#if wasBootstrapEverUsed != null}
						<div>
							<dt>Bootstrap ever used</dt>
							<dd>
								{wasBootstrapEverUsed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moneroNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
