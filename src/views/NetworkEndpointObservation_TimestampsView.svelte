<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NetworkEndpointObservation_Timestamp> = $props()


	// Components
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkEndpointObservation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					endpointKind: true,
					health: true,
					latencyMs: true,
					endpointUrl: true,
					source: true,
					corsEnabled: true,
					proxyAllowed: true,
					error: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: networkEndpointObservationTimestamp })}
		{@const networkEndpointObservationTimestampSelector = networkEndpointObservationTimestamp[EntityMetaKey.Selector]}
		{@const selection = select(EntityType.NetworkEndpointObservation_Timestamp, networkEndpointObservationTimestampSelector)}
		<ProjectionBoundary
			resource={selection.Execution}
		>
			{#snippet Applicable(networkEndpointObservationTimestampProjection0)}
				<ResourceBoundary
					resource={networkEndpointObservationTimestampProjection0.peerCount}
				>
					{#snippet children(executionPeerCount0)}
						<EntityView
							entityType={EntityType.NetworkEndpointObservation_Timestamp}
							entitySelector={networkEndpointObservationTimestampSelector}
						>
							{#snippet Title()}
								{[String(networkEndpointObservationTimestampSelector.timestampMs), networkEndpointObservationTimestampSelector.endpointKind, String(executionPeerCount0 ?? '')].filter(Boolean).join(' ') || 'network endpoint observation timestamp'}
							{/snippet}

							{#snippet Value()}
								{[(networkEndpointObservationTimestamp.health ?? ''), String(networkEndpointObservationTimestamp.latencyMs ?? ''), String(executionPeerCount0 ?? '')].filter(Boolean).join(' ')}
							{/snippet}

							{#snippet HeadingAfter()}
								<span data-text="annotation">{[networkEndpointObservationTimestampSelector.endpointUrl, networkEndpointObservationTimestampSelector.source, String(networkEndpointObservationTimestamp.corsEnabled ?? ''), String(networkEndpointObservationTimestamp.proxyAllowed ?? ''), (networkEndpointObservationTimestamp.error ?? '')].filter(Boolean).join(' ')}</span>
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Beacon}
		>
			{#snippet Applicable(networkEndpointObservationTimestampProjection1)}
				<ResourceBoundary
					resource={networkEndpointObservationTimestampProjection1.statusCode}
				>
					{#snippet children(beaconStatusCode0)}
						<ResourceBoundary
							resource={networkEndpointObservationTimestampProjection1.version}
						>
							{#snippet children(beaconVersion1)}
								<ResourceBoundary
									resource={networkEndpointObservationTimestampProjection1.disconnectedPeerCount}
								>
									{#snippet children(beaconDisconnectedPeerCount2)}
										<ResourceBoundary
											resource={networkEndpointObservationTimestampProjection1.connectingPeerCount}
										>
											{#snippet children(beaconConnectingPeerCount3)}
												<ResourceBoundary
													resource={networkEndpointObservationTimestampProjection1.connectedPeerCount}
												>
													{#snippet children(beaconConnectedPeerCount4)}
														<ResourceBoundary
															resource={networkEndpointObservationTimestampProjection1.disconnectingPeerCount}
														>
															{#snippet children(beaconDisconnectingPeerCount5)}
																<ResourceBoundary
																	resource={networkEndpointObservationTimestampProjection1.headSlot}
																>
																	{#snippet children(beaconHeadSlot6)}
																		<ResourceBoundary
																			resource={networkEndpointObservationTimestampProjection1.syncDistance}
																		>
																			{#snippet children(beaconSyncDistance7)}
																				<ResourceBoundary
																					resource={networkEndpointObservationTimestampProjection1.isSyncing}
																				>
																					{#snippet children(beaconIsSyncing8)}
																						<ResourceBoundary
																							resource={networkEndpointObservationTimestampProjection1.isOptimistic}
																						>
																							{#snippet children(beaconIsOptimistic9)}
																								<ResourceBoundary
																									resource={networkEndpointObservationTimestampProjection1.executionLayerOffline}
																								>
																									{#snippet children(beaconExecutionLayerOffline10)}
																										<ResourceBoundary
																											resource={networkEndpointObservationTimestampProjection1.peerId}
																										>
																											{#snippet children(beaconPeerId11)}
																												<ResourceBoundary
																													resource={networkEndpointObservationTimestampProjection1.enr}
																												>
																													{#snippet children(beaconEnr12)}
																														<ResourceBoundary
																															resource={networkEndpointObservationTimestampProjection1.p2pAddresses}
																														>
																															{#snippet children(beaconP2pAddresses13)}
																																<ResourceBoundary
																																	resource={networkEndpointObservationTimestampProjection1.discoveryAddresses}
																																>
																																	{#snippet children(beaconDiscoveryAddresses14)}
																																		<ResourceBoundary
																																			resource={networkEndpointObservationTimestampProjection1.metadataSequenceNumber}
																																		>
																																			{#snippet children(beaconMetadataSequenceNumber15)}
																																				<ResourceBoundary
																																					resource={networkEndpointObservationTimestampProjection1.attestationSubnets}
																																				>
																																					{#snippet children(beaconAttestationSubnets16)}
																																						<ResourceBoundary
																																							resource={networkEndpointObservationTimestampProjection1.syncCommitteeSubnets}
																																						>
																																							{#snippet children(beaconSyncCommitteeSubnets17)}
																																								<ResourceBoundary
																																									resource={networkEndpointObservationTimestampProjection1.custodyGroupCount}
																																								>
																																									{#snippet children(beaconCustodyGroupCount18)}
																																										<EntityView
																																											entityType={EntityType.NetworkEndpointObservation_Timestamp}
																																											entitySelector={networkEndpointObservationTimestampSelector}
																																										>
																																											{#snippet Title()}
																																												{[String(networkEndpointObservationTimestampSelector.timestampMs), networkEndpointObservationTimestampSelector.endpointKind].filter(Boolean).join(' ') || 'network endpoint observation timestamp'}
																																											{/snippet}

																																											{#snippet Value()}
																																												{[(networkEndpointObservationTimestamp.health ?? ''), String(networkEndpointObservationTimestamp.latencyMs ?? ''), String(beaconStatusCode0 ?? ''), (beaconVersion1 ?? ''), String(beaconDisconnectedPeerCount2 ?? ''), String(beaconConnectingPeerCount3 ?? ''), String(beaconConnectedPeerCount4 ?? ''), String(beaconDisconnectingPeerCount5 ?? ''), String(beaconHeadSlot6 ?? ''), String(beaconSyncDistance7 ?? ''), String(beaconIsSyncing8 ?? ''), String(beaconIsOptimistic9 ?? ''), String(beaconExecutionLayerOffline10 ?? '')].filter(Boolean).join(' ')}
																																											{/snippet}

																																											{#snippet HeadingAfter()}
																																												<span data-text="annotation">{[networkEndpointObservationTimestampSelector.endpointUrl, networkEndpointObservationTimestampSelector.source, (beaconPeerId11 ?? ''), (beaconEnr12 ?? ''), beaconP2pAddresses13.values.join(', '), beaconDiscoveryAddresses14.values.join(', '), String(beaconMetadataSequenceNumber15 ?? ''), (beaconAttestationSubnets16 ?? ''), (beaconSyncCommitteeSubnets17 ?? ''), String(beaconCustodyGroupCount18 ?? ''), String(networkEndpointObservationTimestamp.corsEnabled ?? ''), String(networkEndpointObservationTimestamp.proxyAllowed ?? ''), (networkEndpointObservationTimestamp.error ?? '')].filter(Boolean).join(' ')}</span>
																																											{/snippet}
																																										</EntityView>
																																									{/snippet}
																																								</ResourceBoundary>
																																							{/snippet}
																																						</ResourceBoundary>
																																					{/snippet}
																																				</ResourceBoundary>
																																			{/snippet}
																																		</ResourceBoundary>
																																	{/snippet}
																																</ResourceBoundary>
																															{/snippet}
																														</ResourceBoundary>
																													{/snippet}
																												</ResourceBoundary>
																											{/snippet}
																										</ResourceBoundary>
																									{/snippet}
																								</ResourceBoundary>
																							{/snippet}
																						</ResourceBoundary>
																					{/snippet}
																				</ResourceBoundary>
																			{/snippet}
																		</ResourceBoundary>
																	{/snippet}
																</ResourceBoundary>
															{/snippet}
														</ResourceBoundary>
													{/snippet}
												</ResourceBoundary>
											{/snippet}
										</ResourceBoundary>
									{/snippet}
								</ResourceBoundary>
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
