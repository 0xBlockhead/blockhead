// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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

const bindings = [
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
		artifacts: safeTransactionServiceRestArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.SafeTransactionService_Rest]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2]] }>(bindings)
