// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadLogosBlockchainWalletKeyState_TimestampSelector {
	WalletKeyStateTimestampMsSource = 'WalletKeyStateTimestampMsSource',
}
export const BlockheadLogosBlockchainWalletKeyState_Timestamp = entity({
	entityType: EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp,
	labels: {
		singular: 'blockhead Logos blockchain wallet key state timestamp',
		plural: 'blockhead Logos blockchain wallet key state observations',
	},
})({
	$walletKeyState: {
		label: 'wallet key state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLogosBlockchainWalletKeyState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tip: {
		label: 'tip',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balance: {
		label: 'balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		WalletKeyStateTimestampMsSource: [
			'$walletKeyState',
			'timestampMs',
			'source',
		],
	},
})
