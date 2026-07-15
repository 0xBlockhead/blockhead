// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGStorageNode_TimestampSelector {
	StorageNodeTimestampMsSource = 'StorageNodeTimestampMsSource',
}
export const ZeroGStorageNode_Timestamp = entity({
	entityType: EntityType.ZeroGStorageNode_Timestamp,
	labels: {
		singular: 'zero g storage node timestamp',
		plural: 'zero g storage node observations',
	},
})({
	$storageNode: {
		label: 'storage node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGStorageNode,
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
	balance: {
		label: 'balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalReward: {
		label: 'total reward',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	winCount: {
		label: 'win count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	miningAttempts: {
		label: 'mining attempts',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		StorageNodeTimestampMsSource: [
			'$storageNode',
			'timestampMs',
			'source',
		],
	},
})
