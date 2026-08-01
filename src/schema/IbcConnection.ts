// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IbcConnection,
	labels: {
		singular: 'IBC connection',
		plural: 'IBC connections',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	connectionId: {
		label: 'Connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientId: {
		label: 'Client ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$client: {
		label: 'Client',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IbcClient,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyClientId: {
		label: 'Counterparty client ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyConnectionId: {
		label: 'Counterparty connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'State',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delayPeriodNs: {
		label: 'Delay period ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$channels: {
		label: 'Channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IbcChannel,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkConnectionId: [
			'$network',
			'connectionId',
		],
	},
})
