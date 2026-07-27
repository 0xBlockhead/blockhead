// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Openchain_Rest]: {
		source: Source.Openchain_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'evm-signatures',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.4byte.sourcify.dev/signature-database/v1',
				origin: 'https://api.4byte.sourcify.dev',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://www.4byte.directory/api/v1',
				origin: 'https://www.4byte.directory',
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
		proxyId: '["Openchain_Rest","Global","evm-signatures","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Openchain/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
