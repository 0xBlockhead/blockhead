import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BittensorNeuronSelector {
	BittensorSubnetUid = 'bittensorSubnetUid',
	SubnetUid = '$subnet+uid',
}
export default {
	entityType: EntityType.BittensorNeuron,
	label: 'bittensor neuron',
	labelPlural: 'bittensor neurons',
	selectors: [
		{
			name: BittensorNeuronSelector.BittensorSubnetUid,
			fields: [
				'$subnet',
				'uid',
			],
		},
	],
	fields: [
		{
			name: '$subnet',
			label: 'subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BittensorSubnet,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'uid',
			label: 'UID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
