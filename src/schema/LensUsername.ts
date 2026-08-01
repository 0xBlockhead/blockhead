// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensUsername,
	labels: {
		singular: 'Lens username',
		plural: 'Lens usernames',
	},
})({
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	localName: {
		label: 'Local name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownedBy: {
		label: 'Owned by',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	linkedTo: {
		label: 'Linked to',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		entityType: EntityType.LensUsernameNamespace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'Account',
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$owner: {
		label: 'Owner',
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
