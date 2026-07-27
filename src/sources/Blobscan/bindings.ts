// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const blobscanRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const blobscanRestCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const blobscanRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Blobscan/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.Blobscan_Rest]: [
		{
			source: Source.Blobscan_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '1',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.blobscan.com',
					origin: 'https://api.blobscan.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: blobscanRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blobscanRestCredentials,
			proxyId: '["Blobscan_Rest","Eip155Chain","1","HttpProxy","RestJson"]',
			artifacts: blobscanRestArtifacts,
		},
		{
			source: Source.Blobscan_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '11155111',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.sepolia.blobscan.com',
					origin: 'https://api.sepolia.blobscan.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: blobscanRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blobscanRestCredentials,
			proxyId: '["Blobscan_Rest","Eip155Chain","11155111","HttpProxy","RestJson"]',
			artifacts: blobscanRestArtifacts,
		},
		{
			source: Source.Blobscan_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '100',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.gnosis.blobscan.com',
					origin: 'https://api.gnosis.blobscan.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: blobscanRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blobscanRestCredentials,
			proxyId: '["Blobscan_Rest","Eip155Chain","100","HttpProxy","RestJson"]',
			artifacts: blobscanRestArtifacts,
		},
		{
			source: Source.Blobscan_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '560048',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.hoodi.blobscan.com',
					origin: 'https://api.hoodi.blobscan.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: blobscanRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: blobscanRestCredentials,
			proxyId: '["Blobscan_Rest","Eip155Chain","560048","HttpProxy","RestJson"]',
			artifacts: blobscanRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
