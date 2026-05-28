import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.Erc4337SmartAccount,

	label: 'ERC-4337 smart account',
	labelPlural: 'ERC-4337 smart accounts',

	id: type({
		$network: Network.id,
		address: EvmAddress,
	}),

	fields: [
		{
			name: 'userOperationsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$factory',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Erc4337AccountFactory,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
