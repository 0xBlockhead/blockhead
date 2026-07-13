// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebTransactionSelector {
	LitecoinMwebBlockTransactionIndex = 'LitecoinMwebBlockTransactionIndex',
}
export const LitecoinMwebTransaction = entity({
	entityType: EntityType.LitecoinMwebTransaction,
	labels: {
		singular: 'litecoin MWEB transaction',
		plural: 'litecoin MWEB transactions',
	},
})({
	$mwebBlock: {
		label: 'MWEB block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LitecoinMwebBlock,
		cardinality: EntityFieldCardinality.One,
	},
	transactionIndex: {
		label: 'transaction index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	kernelOffset: {
		label: 'kernel offset',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outputs: {
		label: 'outputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LitecoinMwebOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pegIns: {
		label: 'peg ins',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LitecoinMwebPegIn,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pegOuts: {
		label: 'peg outs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LitecoinMwebPegOut,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		LitecoinMwebBlockTransactionIndex: [
			'$mwebBlock',
			'transactionIndex',
		],
	},
})
