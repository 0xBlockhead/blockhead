import { type } from 'arktype'
import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalOn,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import EvmContract from '$/schema/EvmContract.ts'

const evmNftDiscriminatorFields = [
	{
		name: 'standard',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(EvmNftStandard),
		cardinality: EntityFieldCardinality.One,
	},
	{
		name: 'format',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(EvmNftFormat),
		cardinality: EntityFieldCardinality.One,
	},
] as const satisfies readonly EntityFieldDefinition[]

const eip8004RegistrationCondition = conditionalOn(
	evmNftDiscriminatorFields,
	'format',
	[
		EvmNftFormat.Eip8004Registration,
	],
)

export default {
	entityType: EntityType.EvmNft,

	label: 'EVM NFT',
	labelPlural: 'EVM NFTs',

	id: type({
		$contract: EvmContract.id,
		tokenId: 'string',
	}),

	fields: [
		...evmNftDiscriminatorFields,
		{
			name: 'tokenUri',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'image',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'agentRegistry',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'agentId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'agentUri',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'contactEndpoint',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: '$agentWallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'x402Support',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'supportedTrust',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'registrationTypeIri',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: eip8004RegistrationCondition,
		},
		{
			name: 'fetchedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
