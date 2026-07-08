// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiRegulatedCoinState_TimestampSelector {
	CoinTypeTimestampMsSource = 'CoinTypeTimestampMsSource',
}
export const SuiRegulatedCoinState_Timestamp = entity({
	entityType: EntityType.SuiRegulatedCoinState_Timestamp,
	label: 'sui regulated coin state timestamp',
	labelPlural: 'sui regulated coin state observations',
})({
	$coinType: {
		label: 'coin type',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiCoinType,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	denyCapObjectId: {
		label: 'deny cap object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denyListObjectId: {
		label: 'deny list object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	globalPause: {
		label: 'global pause',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	denyListEpoch: {
		label: 'deny list epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deniedAddressCount: {
		label: 'denied address count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authoritySelector: {
		label: 'authority selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CoinTypeTimestampMsSource: [
			'$coinType',
			'timestampMs',
			'source',
		],
	},
})
