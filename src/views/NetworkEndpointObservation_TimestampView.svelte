<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.NetworkEndpointObservation_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const networkEndpointObservationTimestamp = $derived(viewSelection({
		fields: {
			health: true,
			latencyMs: true,
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
	entityType={EntityType.NetworkEndpointObservation_Timestamp}
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
		<ResourceBoundary resource={networkEndpointObservationTimestamp}>
			{#snippet children(entity)}
				{[(entity.health ?? ''), String(entity.latencyMs ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.endpointKind}
		</span>

		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>endpoint URL</dt>
				<dd>
					<a
						href={selection.entitySelector.endpointUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.endpointUrl} />
					</a>
				</dd>
			</div>

			<div>
				<dt>endpoint kind</dt>
				<dd>
					{selection.entitySelector.endpointKind}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
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
				resource={networkEndpointObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const health = entity.health}
					{#if health != null}
						<div>
							<dt>health</dt>
							<dd>
								{health}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={networkEndpointObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const latencyMs = entity.latencyMs}
					{#if latencyMs != null}
						<div>
							<dt>latency ms</dt>
							<dd>
								<NumberValue
									value={latencyMs}
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
							corsEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const corsEnabled = entity.corsEnabled}
					{#if corsEnabled != null}
						<div>
							<dt>CORS enabled</dt>
							<dd>
								{corsEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							proxyAllowed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proxyAllowed = entity.proxyAllowed}
					{#if proxyAllowed != null}
						<div>
							<dt>proxy allowed</dt>
							<dd>
								{proxyAllowed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ProjectionBoundary
			resource={selection.Execution}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.peerCount}
					>
						{#snippet children(peerCount)}
							{#if peerCount != null}
								<div>
									<dt>Peer count</dt>
									<dd>
										<NumberValue
											value={peerCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Beacon}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.disconnectedPeerCount}
					>
						{#snippet children(disconnectedPeerCount)}
							{#if disconnectedPeerCount != null}
								<div>
									<dt>Disconnected peers</dt>
									<dd>
										<NumberValue
											value={disconnectedPeerCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.connectingPeerCount}
					>
						{#snippet children(connectingPeerCount)}
							{#if connectingPeerCount != null}
								<div>
									<dt>Connecting peers</dt>
									<dd>
										<NumberValue
											value={connectingPeerCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.connectedPeerCount}
					>
						{#snippet children(connectedPeerCount)}
							{#if connectedPeerCount != null}
								<div>
									<dt>Connected peers</dt>
									<dd>
										<NumberValue
											value={connectedPeerCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.disconnectingPeerCount}
					>
						{#snippet children(disconnectingPeerCount)}
							{#if disconnectingPeerCount != null}
								<div>
									<dt>Disconnecting peers</dt>
									<dd>
										<NumberValue
											value={disconnectingPeerCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.headSlot}
					>
						{#snippet children(headSlot)}
							{#if headSlot != null}
								<div>
									<dt>Head slot</dt>
									<dd>
										<NumberValue
											value={headSlot}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.syncDistance}
					>
						{#snippet children(syncDistance)}
							{#if syncDistance != null}
								<div>
									<dt>Sync distance</dt>
									<dd>
										<NumberValue
											value={syncDistance}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.isSyncing}
					>
						{#snippet children(isSyncing)}
							{#if isSyncing != null}
								<div>
									<dt>Syncing</dt>
									<dd>
										{isSyncing ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.isOptimistic}
					>
						{#snippet children(isOptimistic)}
							{#if isOptimistic != null}
								<div>
									<dt>Optimistic</dt>
									<dd>
										{isOptimistic ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.executionLayerOffline}
					>
						{#snippet children(executionLayerOffline)}
							{#if executionLayerOffline != null}
								<div>
									<dt>Execution layer offline</dt>
									<dd>
										{executionLayerOffline ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.version}
					>
						{#snippet children(version)}
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
						resource={projection.peerId}
					>
						{#snippet children(peerId)}
							{#if peerId != null}
								<div>
									<dt>Peer ID</dt>
									<dd>
										{peerId}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.enr}
					>
						{#snippet children(enr)}
							{#if enr != null}
								<div>
									<dt>ENR</dt>
									<dd>
										{enr}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>P2P addresses</dt>
						<dd>
							<ResourceBoundary
								resource={projection.p2pAddresses}
							>
								{#snippet children(p2pAddresses)}
									{p2pAddresses.values.join(', ')}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Discovery addresses</dt>
						<dd>
							<ResourceBoundary
								resource={projection.discoveryAddresses}
							>
								{#snippet children(discoveryAddresses)}
									{discoveryAddresses.values.join(', ')}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.metadataSequenceNumber}
					>
						{#snippet children(metadataSequenceNumber)}
							{#if metadataSequenceNumber != null}
								<div>
									<dt>Metadata sequence number</dt>
									<dd>
										<NumberValue
											value={metadataSequenceNumber}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.attestationSubnets}
					>
						{#snippet children(attestationSubnets)}
							{#if attestationSubnets != null}
								<div>
									<dt>Attestation subnets</dt>
									<dd>
										{attestationSubnets}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.syncCommitteeSubnets}
					>
						{#snippet children(syncCommitteeSubnets)}
							{#if syncCommitteeSubnets != null}
								<div>
									<dt>Sync committee subnets</dt>
									<dd>
										{syncCommitteeSubnets}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.custodyGroupCount}
					>
						{#snippet children(custodyGroupCount)}
							{#if custodyGroupCount != null}
								<div>
									<dt>Custody group count</dt>
									<dd>
										<NumberValue
											value={custodyGroupCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.statusCode}
					>
						{#snippet children(statusCode)}
							{#if statusCode != null}
								<div>
									<dt>Health status code</dt>
									<dd>
										<NumberValue
											value={statusCode}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
