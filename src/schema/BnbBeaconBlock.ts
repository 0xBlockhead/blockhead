// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbBeaconBlock,
	labels: {
		singular: 'bnb beacon block',
		plural: 'bnb beacon blocks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BnbBeaconNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		label: 'Height',
		description: 'The block or ledger height in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proposerAddress: {
		label: 'proposer address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	appHash: {
		label: 'app hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataHash: {
		label: 'data hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validatorsHash: {
		label: 'validators hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nextValidatorsHash: {
		label: 'next validators hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusHash: {
		label: 'consensus hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHash: {
		label: 'evidence hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		label: 'transaction count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHeight: [
			'$network',
			'height',
		],
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})
