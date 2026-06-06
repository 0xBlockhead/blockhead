import { type } from 'arktype'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.BlockheadWallet,

	label: 'Wallet',
	labelPlural: 'Wallets',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'icon',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletProtocol),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'discoveryKind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletDiscoveryKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transportKind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletTransportKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rdns',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'websiteUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'capabilities',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletCapability).array(),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
