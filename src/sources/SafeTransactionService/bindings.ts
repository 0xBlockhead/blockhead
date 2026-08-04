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
import { safeTransactionServiceHosts } from '$/sources/SafeTransactionService/Rest/constants.ts'

const safeTransactionServiceRestBindingAxes = {
	source: Source.SafeTransactionService_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
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

export default indexSourceBindings(mapSourceBindings(
	safeTransactionServiceHosts.map((host) => ({
		key: String(host.chainId),
		locator: host.baseUrl,
	})),
	({
		key,
		locator,
	}) => ({
		...safeTransactionServiceRestBindingAxes,
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
