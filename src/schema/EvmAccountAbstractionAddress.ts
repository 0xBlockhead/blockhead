import { type } from 'arktype'

import { EvmAccountAbstractionRegistryRole } from '$/constants/EvmAccountAbstractionRegistryRole.ts'


import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.EvmAccountAbstractionAddress,

	label: 'Account abstraction address',
	labelPlural: 'Account abstraction addresses',

	id: type({
		$network: Network.id,
		address: EvmAddress,
		role: type.valueOf(EvmAccountAbstractionRegistryRole),
	}),

	fields: [
		{
			name: 'totalOperations',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
