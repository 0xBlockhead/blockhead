// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Xrpc,
		apiFamily: ApiFamily.XrpcLexicon,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.Lexicon,
				path: 'src/sources/AtprotoBskySocial/Lexicon',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/AtprotoBskySocial/Lexicon/schema-source.ts',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
