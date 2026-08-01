// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RoyaltyRight_Timestamp,
	labels: {
		singular: 'royalty right timestamp',
		plural: 'royalty right observations',
	},
})({
	targetKey: {
		label: 'target key',
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
	$collection: {
		label: 'collection',
		entityType: EntityType.NftCollection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		entityType: EntityType.NftToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receiverSelector: {
		label: 'receiver selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	basisPoints: {
		label: 'basis points',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	calculationKind: {
		label: 'calculation kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	salePriceDenominationPolicy: {
		label: 'sale price denomination policy',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	enforcementKind: {
		label: 'enforcement kind',
		primitiveType: type('string'),
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
		TargetKeyRightKeyTimestampMsSource: [
			'targetKey',
			'rightKey',
			'timestampMs',
			'source',
		],
	},
})
