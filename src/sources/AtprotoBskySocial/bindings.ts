// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/AtprotoBskySocial/Lexicon/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.Lexicon,
				path: 'src/sources/AtprotoBskySocial/Lexicon',
			},
		],
	},
] as const satisfies readonly SourceBinding[])
