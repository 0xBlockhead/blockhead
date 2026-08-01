// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const blobscanRestRestJsonHttpProxyBindingAxes = {
	source: Source.Blobscan_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Blobscan/Rest/types.ts',
		},
	],
} as const

const bindings = [
	{
		...blobscanRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.blobscan.com',
				corsEnabled: false,
			},
		],
	},
	{
		...blobscanRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.sepolia.blobscan.com',
				corsEnabled: false,
			},
		],
	},
	{
		...blobscanRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '100',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.gnosis.blobscan.com',
				corsEnabled: false,
			},
		],
	},
	{
		...blobscanRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '560048',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.hoodi.blobscan.com',
				corsEnabled: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
