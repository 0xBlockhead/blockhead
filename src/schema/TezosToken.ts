// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosToken,
	labels: {
		singular: 'tezos token',
		plural: 'tezos tokens',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	contractAddress: {
		label: 'contract address',
		description: 'The contract address on its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		label: 'standard',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$contract: {
		label: 'contract',
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.TezosToken_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$balanceTimestamps: {
		label: 'balance timestamps',
		entityType: EntityType.TezosTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkContractAddressTokenId: [
			'$network',
			'contractAddress',
			'tokenId',
		],
	},
})
