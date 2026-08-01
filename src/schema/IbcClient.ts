// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IbcClient,
	labels: {
		singular: 'IBC client',
		plural: 'IBC clients',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	clientId: {
		label: 'Client ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientType: {
		label: 'Client type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latestHeight: {
		label: 'Latest height',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	frozenHeight: {
		label: 'Frozen height',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trustLevel: {
		label: 'Trust level',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trustingPeriodNs: {
		label: 'Trusting period ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unbondingPeriodNs: {
		label: 'Unbonding period ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxClockDriftNs: {
		label: 'Max clock drift ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyChainId: {
		label: 'Counterparty chain ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterpartyNetwork: {
		label: 'Counterparty network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusStates: {
		label: 'Consensus states',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$connections: {
		label: 'Connections',
		entityType: EntityType.IbcConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channels: {
		label: 'Channels',
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkClientId: [
			'$network',
			'clientId',
		],
	},
})
