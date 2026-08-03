// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const getBlockYellowstoneGrpcSources = [
	Source.GetBlockYellowstone_Grpc,
] as const
const getBlockYellowstoneGrpcSolanaJsonRpcSources = [
	Source.GetBlockYellowstone_Grpc,
	Source.Solana_JsonRpc,
] as const

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
		defaultSources: getBlockYellowstoneGrpcSources,
	},
	lamports: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: getBlockYellowstoneGrpcSolanaJsonRpcSources,
	},
	$ownerProgram: {
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: getBlockYellowstoneGrpcSolanaJsonRpcSources,
	},
	executable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: getBlockYellowstoneGrpcSolanaJsonRpcSources,
	},
	rentEpoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: getBlockYellowstoneGrpcSolanaJsonRpcSources,
	},
	spaceBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: getBlockYellowstoneGrpcSources,
	},
	dataEncoding: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: getBlockYellowstoneGrpcSolanaJsonRpcSources,
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
