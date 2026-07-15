// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum SolanaAccount_TimestampSelector {
	AccountSlotSource = 'AccountSlotSource',
}
export const SolanaAccount_Timestamp = entity({
	entityType: EntityType.SolanaAccount_Timestamp,
	labels: {
		singular: 'solana account timestamp',
		plural: 'Solana account observations',
	},
})({
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaAccount,
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
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
		],
	},
	lamports: {
		label: 'Lamports',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	$ownerProgram: {
		label: 'Owner program',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	executable: {
		label: 'Executable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	rentEpoch: {
		label: 'Rent epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	spaceBytes: {
		label: 'Space bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
		],
	},
	dataEncoding: {
		label: 'Data encoding',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	parsedData: {
		label: 'Parsed data',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountSlotSource: [
			'$account',
			'slot',
			'source',
		],
	},
})
