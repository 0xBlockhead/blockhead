// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum LensUsernameSelector {
	NamespaceLocalName = 'NamespaceLocalName',
	Id = 'Id',
}
export const LensUsername = entity({
	entityType: EntityType.LensUsername,
	labels: {
		singular: 'Lens username',
		plural: 'Lens usernames',
	},
})({
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	localName: {
		label: 'Local name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownedBy: {
		label: 'Owned by',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	linkedTo: {
		label: 'Linked to',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensUsernameNamespace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$owner: {
		label: 'Owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NamespaceLocalName: [
			'namespace',
			'localName',
		],
		Id: [
			'id',
		],
	},
})
