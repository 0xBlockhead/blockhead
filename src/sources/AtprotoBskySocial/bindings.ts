// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.Atproto_BskySocial_Xrpc]: typeof bindings[0] }>(bindings)
