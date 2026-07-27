// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Snapchain_Rest]: {
		source: Source.Snapchain_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'farcaster-snapchain',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://hub.pinata.cloud',
				origin: 'https://hub.pinata.cloud',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://snap.farcaster.xyz:3381',
				origin: 'https://snap.farcaster.xyz:3381',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://pop.farcaster.xyz:3381',
				origin: 'https://pop.farcaster.xyz:3381',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://haatz.quilibrium.com',
				origin: 'https://haatz.quilibrium.com',
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
		proxyId: '["Snapchain_Rest","Global","farcaster-snapchain","HttpProxy","RestJson"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Snapchain/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
