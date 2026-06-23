import { Source } from '$/sources/Source.ts'
import { SourceArtifactKind } from '$/sources/SourceBinding.ts'

export const officialSourceArtifacts = [
	{
		source: Source.Atproto_Xrpc,
		artifactKind: SourceArtifactKind.Lexicon,
		officialUrl: 'https://github.com/bluesky-social/atproto/tree/main/lexicons',
		localPath: 'src/sources/AtprotoBsky/Lexicon',
	},
	{
		source: Source.Atproto_BskySocial_Xrpc,
		artifactKind: SourceArtifactKind.Lexicon,
		officialUrl: 'https://github.com/bluesky-social/atproto/tree/main/lexicons',
		localPath: 'src/sources/AtprotoBskySocial/Lexicon',
	},
	{
		source: Source.AptosIndexer_Graphql,
		artifactKind: SourceArtifactKind.GraphqlSchema,
		officialUrl: 'https://aptos.dev/en/build/indexer/indexer-api/api-reference',
		localPath: 'src/sources/AptosIndexer/Graphql/introspection.json',
	},
	{
		source: Source.Beacon_Rest,
		artifactKind: SourceArtifactKind.OpenApiSpec,
		officialUrl: 'https://github.com/ethereum/beacon-APIs/blob/master/beacon-node-oapi.yaml',
		localPath: 'src/sources/Beacon/OpenApi/openapi.yaml',
	},
	{
		source: Source.CardanoBlockfrost_Rest,
		artifactKind: SourceArtifactKind.OpenApiSpec,
		officialUrl: 'https://github.com/blockfrost/openapi/blob/master/openapi.yaml',
		localPath: 'src/sources/CardanoBlockfrost/OpenApi/openapi.yaml',
	},
	{
		source: Source.Blockfrost_Rest,
		artifactKind: SourceArtifactKind.OpenApiSpec,
		officialUrl: 'https://github.com/blockfrost/openapi/blob/master/openapi.yaml',
		localPath: 'src/sources/Blockfrost/OpenApi/openapi.yaml',
	},
	{
		source: Source.HederaSdk_Grpc,
		artifactKind: SourceArtifactKind.Proto,
		officialUrl: 'https://github.com/hashgraph/hedera-protobufs',
		localPath: 'src/sources/HederaSdk/Grpc/proto',
	},
	{
		source: Source.KaspaNode_Grpc,
		artifactKind: SourceArtifactKind.Proto,
		officialUrl: 'https://github.com/kaspanet/rusty-kaspa/tree/master/rpc/grpc/core/proto',
		localPath: 'src/sources/KaspaNode/Grpc/proto',
	},
	{
		source: Source.Lifi_Rest,
		artifactKind: SourceArtifactKind.OpenApiSpec,
		officialUrl: 'https://docs.li.fi/openapi.yaml',
		localPath: 'src/sources/Lifi/OpenApi/openapi.yaml',
	},
	{
		source: Source.Neynar_Rest,
		artifactKind: SourceArtifactKind.OpenApiSpec,
		officialUrl: 'https://docs.neynar.com/openapi/api/openapi.yaml',
		localPath: 'src/sources/Neynar/OpenApi/openapi.yaml',
	},
	{
		source: Source.OpenSea_Rest,
		artifactKind: SourceArtifactKind.OpenApiSpec,
		officialUrl: 'https://api.opensea.io/api/v2/openapi.json',
		localPath: 'src/sources/OpenSea/OpenApi/openapi.json',
	},
	{
		source: Source.Sui_Graphql,
		artifactKind: SourceArtifactKind.GraphqlSchema,
		officialUrl: 'https://docs.sui.io/references/sui-api/sui-graphql',
		localPath: 'src/sources/Sui/Graphql/schema.graphql',
		enforce: false,
	},
	{
		source: Source.Youtube_Rest,
		artifactKind: SourceArtifactKind.GoogleDiscovery,
		officialUrl: 'https://youtube.googleapis.com/$discovery/rest?version=v3',
		localPath: 'src/sources/Youtube/Discovery/youtube-v3.json',
	},
	{
		source: Source.ZcashLightwalletd_Grpc,
		artifactKind: SourceArtifactKind.Proto,
		officialUrl: 'https://github.com/zcash/lightwalletd/tree/master/walletrpc',
		localPath: 'src/sources/ZcashLightwalletd/Grpc/proto',
	},
] as const
