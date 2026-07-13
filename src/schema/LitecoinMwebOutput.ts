// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebOutputSelector {
	LitecoinMwebTransactionOutputIndex = 'LitecoinMwebTransactionOutputIndex',
}
export const LitecoinMwebOutput = entity({
	entityType: EntityType.LitecoinMwebOutput,
	labels: {
		singular: 'litecoin MWEB output',
		plural: 'litecoin MWEB outputs',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'output index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	commitment: {
		label: 'commitment',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderPubkey: {
		label: 'sender public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$localOutputState: {
		label: 'local output state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLitecoinMwebOutputState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LitecoinMwebTransactionOutputIndex: [
			'$transaction',
			'outputIndex',
		],
	},
})
