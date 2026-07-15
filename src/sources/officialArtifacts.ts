// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceArtifactKind } from '$/sources/SourceBinding.ts'

export const officialSourceArtifacts = [
	{
		source: Source.AptosIndexer_Graphql,
		artifactKind: SourceArtifactKind.GraphqlSchema,
		localPath: 'src/sources/AptosIndexer/Graphql/schema.graphql',
		officialUrl: 'https://api.mainnet.aptoslabs.com/v1/graphql',
	},
] as const
