import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadWalletAccountSelector {
	Caip10 = 'caip10',
}
export default {
	entityType: EntityType.BlockheadWalletAccount,
	label: 'blockhead wallet account',
	labelPlural: 'blockhead wallet accounts',
	selectors: [
		{
			name: BlockheadWalletAccountSelector.Caip10,
			fields: [
				'caip10',
			],
		},
	],
	fields: [
		{
			name: 'caip10',
			label: 'CAIP-10',
			description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
			type: EntityFieldType.Primitive,
			primitiveType: type({"namespace": "string", "reference": "string", "accountAddress": "string"}),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capabilities',
			label: 'capabilities',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[]"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'namespace',
			label: 'Namespace',
			description: 'The namespace that qualifies the identifier.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reference',
			label: 'Reference',
			description: 'The namespace-specific reference value.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'accountAddress',
			label: 'account address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'addressKind',
			label: 'address kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'canonicalAddress',
			label: 'canonical address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'derivationPath',
			label: 'derivation path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publicKey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
