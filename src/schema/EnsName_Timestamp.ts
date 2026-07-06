// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsName_TimestampSelector {
	NameTimestampMsSource = 'NameTimestampMsSource',
}
export default {
	entityType: EntityType.EnsName_Timestamp,
	label: 'ENS name observation',
	labelPlural: 'ENS name observations',
	selectors: [
		{
			name: EnsName_TimestampSelector.NameTimestampMsSource,
			fields: [
				'$name',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$name',
			label: 'Name',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$resolvedActor',
			label: 'Resolved actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$resolverContract',
			label: 'Resolver contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$ownerActor',
			label: 'Owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subdomainCount',
			label: 'Subdomains',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resolverTextKeys',
			label: 'Text record keys',
			type: EntityFieldType.Primitive,
			primitiveType: type('string').array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resolverCoinTypes',
			label: 'Resolver coin types',
			type: EntityFieldType.Primitive,
			primitiveType: type('string').array(),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ttl',
			label: 'TTL',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isMigrated',
			label: 'Migrated',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
