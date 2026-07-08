// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebBlockSelector {
	UtxoBlock = 'UtxoBlock',
}
export const LitecoinMwebBlock = entity({
	entityType: EntityType.LitecoinMwebBlock,
	label: 'litecoin MWEB block',
	labelPlural: 'litecoin MWEB blocks',
})({
	$block: {
		label: 'block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	hogExTransactionId: {
		label: 'hog ex transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	kernelRoot: {
		label: 'kernel root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		UtxoBlock: [
			'$block',
		],
	},
})
