import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const tronSolidityNodeOrigin = 'http://127.0.0.1:8091' as const

export const tronSolidityNodePublicEnv = arktype({
	PUBLIC_TRON_SOLIDITY_NODE_REST_BASE_URL: 'string',
})

export const tronSolidityNodeBindings = [
	{
		provider: SourceProvider.TronSolidityNode,
		source: Source.TronSolidityNode_Rest,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'tron-solidity-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: tronSolidityNodeOrigin,
				origin: tronSolidityNodeOrigin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				keys: [
					'PUBLIC_TRON_SOLIDITY_NODE_REST_BASE_URL',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/TronGrid/Rest/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
