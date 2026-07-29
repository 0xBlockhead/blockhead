// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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

const bindings = [
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
		artifacts: blobscanRestArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Blobscan_Rest]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2], typeof bindings[3]] }>(bindings)
