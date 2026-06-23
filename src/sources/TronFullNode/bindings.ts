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

const tronFullNodeOrigin = 'http://127.0.0.1:8090' as const

export const tronFullNodePublicEnv = arktype({
	PUBLIC_TRON_FULL_NODE_REST_BASE_URL: 'string',
})

export const tronFullNodeBindings = [
	{
		provider: SourceProvider.TronFullNode,
		source: Source.TronFullNode_Rest,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'tron-full-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: tronFullNodeOrigin,
				origin: tronFullNodeOrigin,
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
					'PUBLIC_TRON_FULL_NODE_REST_BASE_URL',
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
