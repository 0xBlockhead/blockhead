// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaValidator_Timestamp,
	labels: {
		singular: 'solana validator timestamp',
		plural: 'Solana validator observations',
	},
})({
	$validator: {
		label: 'Validator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaValidator,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
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
	nodePubkey: {
		label: 'Node public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	activatedStakeLamports: {
		label: 'Activated stake',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	commission: {
		label: 'Commission',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	delinquent: {
		label: 'Delinquent',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	lastVoteSlot: {
		label: 'Last vote slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	rootSlot: {
		label: 'Root slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	epochCredits: {
		label: 'Epoch credits',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
})({
	selectors: {
		ValidatorSlotSource: [
			'$validator',
			'slot',
			'source',
		],
	},
})
