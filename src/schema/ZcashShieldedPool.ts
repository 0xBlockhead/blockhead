import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export enum ZcashShieldedPoolKind {
	Sapling = 'sapling',
	Orchard = 'orchard',
}

export default {
	entityType: EntityType.ZcashShieldedPool,

	label: 'Zcash Sapling/Orchard Pool',
	labelPlural: 'Zcash Sapling/Orchard Pools',

	id: type({
		$network: Network.id,
		pool: type.valueOf(ZcashShieldedPoolKind),
	}),

	fields: [
		{
			name: 'activationNetworkUpgrade',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteProtocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
