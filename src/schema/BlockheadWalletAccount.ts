// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadWalletAccountSelector {
	Caip10 = 'Caip10',
}
export const BlockheadWalletAccount = entity({
	entityType: EntityType.BlockheadWalletAccount,
	labels: {
		singular: 'blockhead wallet account',
		plural: 'blockhead wallet accounts',
	},
})({
	caip10: {
		label: 'CAIP-10',
		description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'namespace': type('string'), 'reference': type('string'), 'accountAddress': type('string') }),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	capabilities: {
		label: 'capabilities',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reference: {
		label: 'Reference',
		description: 'The namespace-specific reference value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountAddress: {
		label: 'account address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addressKind: {
		label: 'address kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canonicalAddress: {
		label: 'canonical address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	derivationPath: {
		label: 'derivation path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicKey: {
		label: 'public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Caip10: [
			'caip10',
		],
	},
})
