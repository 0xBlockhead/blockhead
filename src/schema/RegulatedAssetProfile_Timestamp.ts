// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RegulatedAssetProfile_TimestampSelector {
	ProfileTimestampMsSource = 'ProfileTimestampMsSource',
}
export default {
	entityType: EntityType.RegulatedAssetProfile_Timestamp,
	label: 'regulated asset profile timestamp',
	labelPlural: 'regulated asset profile observations',
	selectors: [
		{
			name: RegulatedAssetProfile_TimestampSelector.ProfileTimestampMsSource,
			fields: [
				'$profile',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RegulatedAssetProfile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerCoordinateKind',
			label: 'ledger coordinate kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateValue',
			label: 'ledger coordinate value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$identityRegistry',
			label: 'identity registry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$compliance',
			label: 'compliance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$trustedIssuersRegistry',
			label: 'trusted issuers registry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$claimTopicsRegistry',
			label: 'claim topics registry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'paused',
			label: 'paused',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registryVersion',
			label: 'registry version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
