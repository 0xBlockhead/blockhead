import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FilecoinSector_TimestampSelector {
	SectorTimestampMsSource = '$sector+timestampMs+source',
}
export default {
	entityType: EntityType.FilecoinSector_Timestamp,
	label: 'filecoin sector timestamp',
	labelPlural: 'filecoin sector observations',
	selectors: [
		{
			name: FilecoinSector_TimestampSelector.SectorTimestampMsSource,
			fields: [
				'$sector',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$sector',
			label: 'sector',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinSector,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'height',
			label: 'Height',
			description: 'The block or ledger height in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tipsetKey',
			label: 'tipset key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$tipset',
			label: 'tipset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sealedCid',
			label: 'sealed CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationEpoch',
			label: 'activation epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expirationEpoch',
			label: 'expiration epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dealIds',
			label: 'deal ids',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
