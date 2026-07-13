// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterLog_TimestampSelector {
	CanisterTimestampMsSource = 'CanisterTimestampMsSource',
}
export const IcpCanisterLog_Timestamp = entity({
	entityType: EntityType.IcpCanisterLog_Timestamp,
	labels: {
		singular: 'icp canister log timestamp',
		plural: 'icp canister log observations',
	},
})({
	$canister: {
		label: 'canister',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpCanister,
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
	lastAnalyzedMessageTimeNs: {
		label: 'last analyzed message time ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageCount: {
		label: 'message count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logVisibility: {
		label: 'log visibility',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messages: {
		label: 'messages',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CanisterTimestampMsSource: [
			'$canister',
			'timestampMs',
			'source',
		],
	},
})
