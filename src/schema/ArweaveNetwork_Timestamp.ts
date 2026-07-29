// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ArweaveNetwork_Timestamp,
	labels: {
		singular: 'arweave network timestamp',
		plural: 'arweave network observations',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ArweaveNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	latestHeight: {
		label: 'latest height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	latestBlockHash: {
		label: 'latest block hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	currentBlockHash: {
		label: 'current block hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	networkId: {
		label: 'network ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	peerCount: {
		label: 'peer count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queuedTransactionCount: {
		label: 'queued transaction count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gatewayOrigin: {
		label: 'gateway origin',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	graphqlCursor: {
		label: 'GraphQL cursor',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		label: 'reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTimestampMsSource: [
			'$network',
			'timestampMs',
			'source',
		],
	},
})
