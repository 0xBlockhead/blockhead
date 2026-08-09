// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadFilecoinPendingMessage,
	labels: {
		singular: 'blockhead filecoin pending message',
		plural: 'blockhead filecoin pending messages',
	},
})({
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	messageCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observedAtMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.FilecoinNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$message: {
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$from: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	method: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasFeeCapAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasPremiumAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureType: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	local: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeIdMessageCidObservedAtMs: [
			'nodeId',
			'messageCid',
			'observedAtMs',
		],
	},
})
