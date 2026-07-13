// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcClientSelector {
	NetworkClientId = 'NetworkClientId',
}
export const IbcClient = entity({
	entityType: EntityType.IbcClient,
	labels: {
		singular: 'IBC client',
		plural: 'IBC clients',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	clientId: {
		label: 'Client ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientType: {
		label: 'Client type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latestHeight: {
		label: 'Latest height',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	frozenHeight: {
		label: 'Frozen height',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trustLevel: {
		label: 'Trust level',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trustingPeriodNs: {
		label: 'Trusting period ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unbondingPeriodNs: {
		label: 'Unbonding period ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	maxClockDriftNs: {
		label: 'Max clock drift ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyChainId: {
		label: 'Counterparty chain ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$counterpartyNetwork: {
		label: 'Counterparty network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusStates: {
		label: 'Consensus states',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$connections: {
		label: 'Connections',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IbcConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channels: {
		label: 'Channels',
		type: EntityFieldType.EntitiesReference,
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
