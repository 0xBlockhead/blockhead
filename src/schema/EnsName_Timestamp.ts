// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsName_Timestamp,
	labels: {
		singular: 'ENS name observation',
		plural: 'ENS name observations',
	},
})({
	$name: {
		label: 'Name',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$resolvedActor: {
		label: 'Resolved actor',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$resolverContract: {
		label: 'Resolver contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ownerActor: {
		label: 'Owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subdomainCount: {
		label: 'Subdomains',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverTextKeys: {
		label: 'Text record keys',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverCoinTypes: {
		label: 'Resolver coin types',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ttl: {
		label: 'TTL',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isMigrated: {
		label: 'Migrated',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NameTimestampMsSource: [
			'$name',
			'timestampMs',
			'source',
		],
	},
})
