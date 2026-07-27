// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Atproto_BskySocial_Xrpc]: {
		source: Source.Atproto_BskySocial_Xrpc,
		target: {
			kind: SourceTargetKind.Global,
			key: 'bsky-social-appview',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://bsky.social',
				origin: 'https://bsky.social',
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
		proxyId: '["Atproto_BskySocial_Xrpc","Global","bsky-social-appview","HttpProxy","XrpcLexicon"]',
		artifacts: [
			{
				kind: SourceArtifactKind.Lexicon,
				path: 'src/sources/AtprotoBskySocial/Lexicon',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/AtprotoBskySocial/Lexicon/schema-source.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
