// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Atproto_Xrpc]: {
		source: Source.Atproto_Xrpc,
		target: {
			kind: SourceTargetKind.Global,
			key: 'bsky-public-appview',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://public.api.bsky.app',
				origin: 'https://public.api.bsky.app',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Xrpc,
		apiFamily: ApiFamily.XrpcLexicon,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["Atproto_Xrpc","Global","bsky-public-appview","HttpProxy","XrpcLexicon"]',
		artifacts: [
			{
				kind: SourceArtifactKind.Lexicon,
				path: 'src/sources/AtprotoBsky/Lexicon',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/AtprotoBsky/Lexicon/schema-source.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
