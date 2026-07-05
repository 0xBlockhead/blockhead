// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterSelector {
	NetworkCanisterId = 'NetworkCanisterId',
}
export default {
	entityType: EntityType.IcpCanister,
	label: 'icp canister',
	labelPlural: 'icp canisters',
	selectors: [
		{
			name: IcpCanisterSelector.NetworkCanisterId,
			fields: [
				'$network',
				'canisterId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IcpNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'canisterId',
				label: 'canister ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$methods',
				label: 'methods',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCanisterMethod,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$metadata',
				label: 'metadata',
				labelPlural: 'metadata entries',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCanisterMetadata,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$logs',
				label: 'logs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCanisterLog_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$certifiedStates',
				label: 'certified states',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCertifiedState,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$requestStatuses',
				label: 'request statuses',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpRequestStatus,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCanister_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
