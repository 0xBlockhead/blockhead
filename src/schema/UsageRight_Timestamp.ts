// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UsageRight_Timestamp,
	labels: {
		singular: 'usage right timestamp',
		plural: 'usage right observations',
	},
})({
	subjectKey: {
		label: 'subject key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rightKey: {
		label: 'right key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceKind: {
		label: 'source kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rightKind: {
		label: 'right kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		label: 'object',
		entityType: EntityType.AssetObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		entityType: EntityType.NftToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$user: {
		label: 'user',
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	userSelector: {
		label: 'user selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiresAt: {
		label: 'expires AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		label: 'ledger coordinate kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateValue: {
		label: 'ledger coordinate value',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		label: 'contract address',
		description: 'The contract address on its network.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubjectKeyRightKeyTimestampMsSource: [
			'subjectKey',
			'rightKey',
			'timestampMs',
			'source',
		],
	},
})
