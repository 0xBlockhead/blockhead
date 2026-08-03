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
	[
		{
			key: '1',
			locator: 'https://api.safe.global/tx-service/eth',
		},
		{
			key: '100',
			locator: 'https://api.safe.global/tx-service/gno',
		},
		{
			key: '8453',
			locator: 'https://api.safe.global/tx-service/base',
		},
	] as const,
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
