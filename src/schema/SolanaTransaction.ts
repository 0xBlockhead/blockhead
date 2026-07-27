// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaTransaction,
	labels: {
		singular: 'solana transaction',
		plural: 'Solana transactions',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'Signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$feePayer: {
		label: 'Fee payer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeLamports: {
		label: 'Fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	computeUnitsConsumed: {
		label: 'Compute units consumed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
	$$instructions: {
		label: 'Instructions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaInstruction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkSignature: [
			'$network',
			'signature',
		],
	},
})
