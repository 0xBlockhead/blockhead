// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	connectionId: {
		label: 'Connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientId: {
		label: 'Client ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$client: {
		label: 'Client',
		entityType: EntityType.IbcClient,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyClientId: {
		label: 'Counterparty client ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	counterpartyConnectionId: {
		label: 'Counterparty connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'State',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delayPeriodNs: {
		label: 'Delay period ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$channels: {
		label: 'Channels',
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
