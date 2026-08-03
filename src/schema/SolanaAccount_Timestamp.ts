// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaAccount_Timestamp,
	labels: {
		singular: 'solana account timestamp',
		plural: 'Solana account observations',
	},
})({
	$account: {
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
		],
	},
	lamports: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	$ownerProgram: {
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	executable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	rentEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	spaceBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
		],
	},
	dataEncoding: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	parsedData: {
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
