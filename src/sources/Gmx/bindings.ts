// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'


const gmxRestBindingAxes = {
	source: Source.Gmx_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Gmx/Rest/types.ts',
			referenceUrl: 'https://docs.gmx.io/docs/api/overview/',
		},
	],
} as const

const gmxRestBindings = [
	{
		...gmxRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.gmxapi.io/v1',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.gmxapi.ai/v1',
				corsEnabled: true,
			},
		],
	},
	{
		...gmxRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '43114',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://avalanche.gmxapi.io/v1',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://avalanche.gmxapi.ai/v1',
				corsEnabled: true,
			},
		],
	},
	{
		...gmxRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '4326',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://megaeth.gmxapi.io/v1',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://megaeth.gmxapi.ai/v1',
				corsEnabled: true,
			},
		],
	},
] as const


export const gmxRestBindingByChainId = Object.fromEntries(
	gmxRestBindings.map((binding) => [
		Number(binding.target.key),
		binding,
	])
)


export default indexSourceBindings(gmxRestBindings)
