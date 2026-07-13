// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RegulatedAssetProfile_TimestampSelector {
	ProfileTimestampMsSource = 'ProfileTimestampMsSource',
}
export const RegulatedAssetProfile_Timestamp = entity({
	entityType: EntityType.RegulatedAssetProfile_Timestamp,
	labels: {
		singular: 'regulated asset profile timestamp',
		plural: 'regulated asset profile observations',
	},
})({
	$profile: {
		label: 'profile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RegulatedAssetProfile,
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
	ledgerCoordinateKind: {
		label: 'ledger coordinate kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ledgerCoordinateValue: {
		label: 'ledger coordinate value',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$identityRegistry: {
		label: 'identity registry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$compliance: {
		label: 'compliance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$trustedIssuersRegistry: {
		label: 'trusted issuers registry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$claimTopicsRegistry: {
		label: 'claim topics registry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paused: {
		label: 'paused',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryVersion: {
		label: 'registry version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProfileTimestampMsSource: [
			'$profile',
			'timestampMs',
			'source',
		],
	},
})
