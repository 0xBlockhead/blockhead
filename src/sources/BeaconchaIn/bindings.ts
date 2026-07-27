// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const beaconchaInRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const beaconchaInRestCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		env: arktype({
			'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
		}),
		keys: [
			'PUBLIC_BEACONCHAIN_API_KEY',
		],
	},
] as const
const beaconchaInRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/BeaconchaIn/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.BeaconchaIn_Rest]: [
		{
			source: Source.BeaconchaIn_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '1',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://beaconcha.in/api/v1',
					origin: 'https://beaconcha.in',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: beaconchaInRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: beaconchaInRestCredentials,
			proxyId: '["BeaconchaIn_Rest","Eip155Chain","1","HttpProxy","RestJson"]',
			artifacts: beaconchaInRestArtifacts,
		},
		{
			source: Source.BeaconchaIn_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '17000',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://holesky.beaconcha.in/api/v1',
					origin: 'https://holesky.beaconcha.in',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: beaconchaInRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: beaconchaInRestCredentials,
			proxyId: '["BeaconchaIn_Rest","Eip155Chain","17000","HttpProxy","RestJson"]',
			artifacts: beaconchaInRestArtifacts,
		},
		{
			source: Source.BeaconchaIn_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '560048',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://hoodi.beaconcha.in/api/v1',
					origin: 'https://hoodi.beaconcha.in',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: beaconchaInRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: beaconchaInRestCredentials,
			proxyId: '["BeaconchaIn_Rest","Eip155Chain","560048","HttpProxy","RestJson"]',
			artifacts: beaconchaInRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
