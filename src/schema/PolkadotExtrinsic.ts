import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Block from '$/schema/PolkadotBlock.ts'

export default {
	entityType: EntityType.PolkadotExtrinsic,

	label: 'Polkadot Extrinsic',
	labelPlural: 'Polkadot Extrinsics',

	id: type({
		$block: Block.id,
		extrinsicIndex: 'number',
	}),

	fields: [
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$pallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotPallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'callName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'success',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
