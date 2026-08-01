// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const beaconchaInRestRestJsonHttpProxyBindingAxes = {
	source: Source.BeaconchaIn_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [
		{
			scope: SourceCredentialScope.PublicConfig,
			env: arktype({
				'PUBLIC_BEACONCHAIN_API_KEY': 'string > 0',
			}),
		},
	],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/BeaconchaIn/Rest/types.ts',
		},
	],
} as const

const bindings = [
	{
		...beaconchaInRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://beaconcha.in/api/v1',
				corsEnabled: false,
			},
		],
	},
	{
		...beaconchaInRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '17000',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://holesky.beaconcha.in/api/v1',
				corsEnabled: false,
			},
		],
	},
	{
		...beaconchaInRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '560048',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hoodi.beaconcha.in/api/v1',
				corsEnabled: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
