// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.TonCenter_V2_Rest]: {
		source: Source.TonCenter_V2_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'toncenter-v2',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{toncenter-v2-api-host}',
				origin: 'https://{toncenter-v2-api-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	[Source.TonCenter_V3_Rest]: {
		source: Source.TonCenter_V3_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'ton:-239',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://toncenter.com/api/v3/',
				origin: 'https://toncenter.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.TonCenterV3Api,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["TonCenter_V3_Rest","Caip2Network","ton:-239","HttpProxy","TonCenterV3Api"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/TonCenter/V3/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
