// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Subscan_Rest]: {
		source: Source.Subscan_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polkadot.api.subscan.io',
				origin: 'https://polkadot.api.subscan.io',
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
				env: arktype({
					'PUBLIC_SUBSCAN_API_KEY': 'string',
				}),
				keys: [
					'PUBLIC_SUBSCAN_API_KEY',
				],
			},
		],
		proxyId: '["Subscan_Rest","Caip2Network","polkadot:91b171bb158e2d3848fa23a9f1c25182","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Subscan/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
