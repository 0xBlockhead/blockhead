// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

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

const safeTransactionServiceRestTargets = [
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
] as const

const bindings = safeTransactionServiceRestTargets.map(({
	key,
	locator,
}) => ({
		...safeTransactionServiceRestRestJsonHttpProxyBindingAxes,
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
} satisfies SourceBinding))

export default indexSourceBindings(bindings)
