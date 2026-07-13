// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmLogSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export const EvmLog = entity({
	entityType: EntityType.EvmLog,
	labels: {
		singular: 'EVM log',
		plural: 'EVM logs',
	},
	description: 'An event log emitted by an EVM transaction receipt.',
})({
	indexInTransaction: {
		label: 'Index in transaction',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$topics: {
		label: 'Topics',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
	},
	topic0: {
		label: 'Topic 0',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'Data',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	removed: {
		label: 'Removed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$emitter: {
		label: 'Emitter contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},

	facets: {
		Event: facet({
			path: [
				'topic0',
			],
			isOneOf: [
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
			],
		})({
			signatureHash: {
				label: 'Signature hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
			},
		})({
			facets: {
				Erc20Transfer: facet({
					path: [
						'Event',
						'signatureHash',
					],
					is: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
				})({
					$$tokenTransfers: {
						label: 'ERC-20 token transfers',
						type: EntityFieldType.EntitiesReference,
						entityType: EntityType.EvmTokenTransfer,
						cardinality: EntityFieldCardinality.Many,
					},
				}),
			},
		}),
	},
})
