// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotExtrinsic,
	labels: {
		singular: 'Polkadot extrinsic',
		plural: 'Polkadot extrinsics',
	},
})({
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotBlock,
		cardinality: EntityFieldCardinality.One,
	},
	indexInBlock: {
		label: 'Index in block',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$signer: {
		label: 'Signer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$pallet: {
		label: 'Pallet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotPallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	callName: {
		label: 'Call name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	success: {
		label: 'Success',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BlockIndexInBlock: [
			'$block',
			'indexInBlock',
		],
	},
})
