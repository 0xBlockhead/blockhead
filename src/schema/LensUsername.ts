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
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	localName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownedBy: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	linkedTo: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$namespace: {
		entityType: EntityType.LensUsernameNamespace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$owner: {
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
