// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const safeTransactionServiceRestRestJsonHttpProxyBindingAxes = {
	source: Source.SafeTransactionService_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [
		{
			scope: SourceCredentialScope.RuntimeSecret,
		},
	],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/SafeTransactionService/Rest/types.ts',
		},
	],
} as const

const bindings = [
	{
		...safeTransactionServiceRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.safe.global/tx-service/eth',
				corsEnabled: false,
			},
		],
	},
	{
		...safeTransactionServiceRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '100',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.safe.global/tx-service/gno',
				corsEnabled: false,
			},
		],
	},
	{
		...safeTransactionServiceRestRestJsonHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '8453',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.safe.global/tx-service/base',
				corsEnabled: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
