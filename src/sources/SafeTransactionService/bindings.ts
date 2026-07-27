// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const safeTransactionServiceRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const safeTransactionServiceRestCredentials = [
	{
		scope: SourceCredentialScope.RuntimeSecret,
	},
] as const
const safeTransactionServiceRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/SafeTransactionService/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.SafeTransactionService_Rest]: [
		{
			source: Source.SafeTransactionService_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '1',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.safe.global/tx-service/eth',
					origin: 'https://api.safe.global',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: safeTransactionServiceRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: safeTransactionServiceRestCredentials,
			proxyId: '["SafeTransactionService_Rest","Eip155Chain","1","HttpProxy","RestJson"]',
			serverCredentialId: '["SafeTransactionService_Rest","Eip155Chain","1","HttpProxy","RestJson"]',
			artifacts: safeTransactionServiceRestArtifacts,
		},
		{
			source: Source.SafeTransactionService_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '100',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.safe.global/tx-service/gno',
					origin: 'https://api.safe.global',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: safeTransactionServiceRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: safeTransactionServiceRestCredentials,
			proxyId: '["SafeTransactionService_Rest","Eip155Chain","100","HttpProxy","RestJson"]',
			serverCredentialId: '["SafeTransactionService_Rest","Eip155Chain","100","HttpProxy","RestJson"]',
			artifacts: safeTransactionServiceRestArtifacts,
		},
		{
			source: Source.SafeTransactionService_Rest,
			target: {
				kind: SourceTargetKind.Eip155Chain,
				key: '8453',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.safe.global/tx-service/base',
					origin: 'https://api.safe.global',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: safeTransactionServiceRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: safeTransactionServiceRestCredentials,
			proxyId: '["SafeTransactionService_Rest","Eip155Chain","8453","HttpProxy","RestJson"]',
			serverCredentialId: '["SafeTransactionService_Rest","Eip155Chain","8453","HttpProxy","RestJson"]',
			artifacts: safeTransactionServiceRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
