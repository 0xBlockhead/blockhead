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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rightKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rightKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$object: {
		entityType: EntityType.AssetObject,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		entityType: EntityType.NftToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$user: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	userSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiresAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateValue: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
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
