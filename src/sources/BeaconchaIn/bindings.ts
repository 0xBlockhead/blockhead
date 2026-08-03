// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	mapSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const beaconchaInRestBindingAxes = {
	source: Source.BeaconchaIn_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
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

export default indexSourceBindings(mapSourceBindings(
	[
		{
			key: '1',
			locator: 'https://beaconcha.in/api/v1',
		},
		{
			key: '17000',
			locator: 'https://holesky.beaconcha.in/api/v1',
		},
		{
			key: '560048',
			locator: 'https://hoodi.beaconcha.in/api/v1',
		},
	] as const,
	({
		key,
		locator,
	}) => ({
		...beaconchaInRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: false,
			},
		],
	})
))
