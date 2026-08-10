// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NetworkEndpointObservation_Timestamp,
	labels: {
		singular: 'network endpoint observation timestamp',
		plural: 'network endpoint observations',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	endpointUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	endpointKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	corsEnabled: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proxyAllowed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	health: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latencyMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkEndpointUrlEndpointKindTimestampMsSource: [
			'$network',
			'endpointUrl',
			'endpointKind',
			'timestampMs',
			'source',
		],
	},

	facets: {
		Execution: facet({
			path: [
				'endpointKind',
			],
			is: 'EvmExecutionJsonRpc',
		})({
			peerCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Voltaire_JsonRpc,
				],
			},
		}),
		Beacon: facet({
			path: [
				'endpointKind',
			],
			is: 'EthereumBeaconRest',
		})({
			disconnectedPeerCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			connectingPeerCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			connectedPeerCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			disconnectingPeerCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			headSlot: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			syncDistance: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			isSyncing: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			isOptimistic: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			executionLayerOffline: {
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			version: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			peerId: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			enr: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			p2pAddresses: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			discoveryAddresses: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			metadataSequenceNumber: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			attestationSubnets: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			syncCommitteeSubnets: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			custodyGroupCount: {
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
			statusCode: {
				primitiveType: type('number.integer >= 0'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Beacon_Rest,
				],
			},
		}),
	},
})
