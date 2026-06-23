import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ElementsPegDirection {
	PegIn = 'PegIn',
	PegOut = 'PegOut',
}
export enum ElementsPegSelector {
	ElementsNetworkPegTransactionIdDirection = 'elementsNetworkPegTransactionIdDirection',
	NetworkPegTransactionIdDirection = '$network+pegTransactionId+direction',
}
export default {
	entityType: EntityType.ElementsPeg,
	label: 'elements peg',
	labelPlural: 'elements pegs',
	selectors: [
		{
			name: ElementsPegSelector.ElementsNetworkPegTransactionIdDirection,
			fields: [
				'$network',
				'pegTransactionId',
				'direction',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pegTransactionId',
			label: 'peg transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'direction',
			label: 'direction',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$bitcoinTransaction',
			label: 'Bitcoin transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$elementsTransaction',
			label: 'elements transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountSats',
			label: 'amount sats',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'claimScript',
			label: 'claim script',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pakProof',
			label: 'pak proof',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ElementsPeg_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
