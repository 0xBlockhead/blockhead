// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvailAppId_TimestampSelector {
	AppIdTimestampMsSource = 'AppIdTimestampMsSource',
}
export const AvailAppId_Timestamp = entity({
	entityType: EntityType.AvailAppId_Timestamp,
	labels: {
		singular: 'avail app ID timestamp',
		plural: 'avail app ID observations',
	},
})({
	$appId: {
		label: 'app ID',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AvailAppId,
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
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dataSubmissionCount: {
		label: 'data submission count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observedSubmissionCount: {
		label: 'observed submission count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AppIdTimestampMsSource: [
			'$appId',
			'timestampMs',
			'source',
		],
	},
})
