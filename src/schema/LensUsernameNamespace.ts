// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum LensUsernameNamespaceSelector {
	Address = 'Address',
}
export const LensUsernameNamespace = entity({
	entityType: EntityType.LensUsernameNamespace,
	labels: {
		singular: 'Lens username namespace',
		plural: 'Lens username namespaces',
	},
})({
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		label: 'Owner',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenName: {
		label: 'Token name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenSymbol: {
		label: 'Token symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalUsernames: {
		label: 'Total usernames',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rules: {
		label: 'Rules',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$usernames: {
		label: 'Usernames',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensUsername,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Address: [
			'address',
		],
	},
})
