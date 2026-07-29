// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
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

const bindings = [
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
		artifacts: beaconchaInRestArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.BeaconchaIn_Rest]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2]] }>(bindings)
