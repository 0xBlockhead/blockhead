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
		label: 'Account',
		entityType: EntityType.SolanaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
		],
	},
	lamports: {
		label: 'Lamports',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	$ownerProgram: {
		label: 'Owner program',
		entityType: EntityType.SolanaProgram,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	executable: {
		label: 'Executable',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	rentEpoch: {
		label: 'Rent epoch',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	spaceBytes: {
		label: 'Space bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
		],
	},
	dataEncoding: {
		label: 'Data encoding',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.GetBlockYellowstone_Grpc,
			Source.Solana_JsonRpc,
		],
	},
	parsedData: {
		label: 'Parsed data',
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
