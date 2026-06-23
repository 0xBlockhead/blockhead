import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum QuilibriumProverSelector {
	NetworkProverPeerId = 'networkProverPeerId',
}
export default {
	entityType: EntityType.QuilibriumProver,
	label: 'quilibrium prover',
	labelPlural: 'quilibrium provers',
	selectors: [
		{
			name: QuilibriumProverSelector.NetworkProverPeerId,
			fields: [
				'$network',
				'proverPeerId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proverPeerId',
			label: 'prover peer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publicKey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSeenAt',
			label: 'last seen AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$frames',
			label: 'frames',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumFrame,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
