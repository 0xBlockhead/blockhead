import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { bskySocialOrigin } from '$/sources/AtprotoBskySocial/Rest/constants.ts'

export const atprotoBskySocialBindings = [
	{
		provider: SourceProvider.AtprotoBskySocial,
		source: Source.Atproto_BskySocial_Xrpc,
		target: {
			kind: SourceTargetKind.Global,
			key: 'bsky-social-appview',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: bskySocialOrigin,
				origin: bskySocialOrigin,
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
