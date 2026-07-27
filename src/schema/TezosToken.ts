// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	contractAddress: {
		label: 'contract address',
		description: 'The contract address on its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	standard: {
		label: 'standard',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosToken_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$balanceTimestamps: {
		label: 'balance timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosTokenBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'transfers',
		type: EntityFieldType.EntitiesReference,
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
