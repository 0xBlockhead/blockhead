import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const hederaMirrorNodeOrigin = 'https://mainnet-public.mirrornode.hedera.com' as const

export const hederaMirrorNodeBindings = [
	{
		provider: SourceProvider.HederaMirrorNode,
		source: Source.HederaMirrorNode_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'hedera-mainnet-mirror-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: hederaMirrorNodeOrigin,
				origin: hederaMirrorNodeOrigin,
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
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
