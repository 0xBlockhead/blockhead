// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CardanoTxOutputSelector {
	TransactionOutputIndex = 'TransactionOutputIndex',
}
export const CardanoTxOutput = entity({
	entityType: EntityType.CardanoTxOutput,
	labels: {
		singular: 'cardano transaction output',
		plural: 'cardano transaction outputs',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'output index',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lovelace: {
		label: 'lovelace',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datumHash: {
		label: 'datum hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inlineDatum: {
		label: 'inline datum',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	referenceScriptHash: {
		label: 'reference script hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentByTxHash: {
		label: 'spent by transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentByInputIndex: {
		label: 'spent by input index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$assets: {
		label: 'assets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTxOutputAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		TransactionOutputIndex: [
			'$transaction',
			'outputIndex',
		],
	},
})
