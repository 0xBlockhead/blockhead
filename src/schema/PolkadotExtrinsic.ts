// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.PolkadotBlock,
		cardinality: EntityFieldCardinality.One,
	},
	indexInBlock: {
		label: 'Index in block',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$signer: {
		label: 'Signer',
		entityType: EntityType.PolkadotAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$pallet: {
		label: 'Pallet',
		entityType: EntityType.PolkadotPallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	callName: {
		label: 'Call name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	success: {
		label: 'Success',
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
