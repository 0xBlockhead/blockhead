// Generated from APP.ts.

import type { SourceServerCredentialDefinition } from '$/sources/SourceBinding.ts'

const runtimeSecretCredentials = [
	[
		'["Amboss_Graphql","Global","amboss-space","HttpProxy","GraphqlHttp"]',
		'AMBOSS_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["Blockfrost_Rest","Caip2Network","cip34:1-764824073","HttpProxy","OpenApiHttp"]',
		'BLOCKFROST_PROJECT_ID',
		{
			header: {
				name: 'project_id',
			},
		},
		undefined,
	],
	[
		'["EigenExplorer_Rest","Global","eigen-explorer-api","HttpProxy","RestJson"]',
		'EIGEN_EXPLORER_API_TOKEN',
		{
			header: {
				name: 'x-api-token',
			},
		},
		undefined,
	],
	[
		'["EnvioHyperRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]',
		'ENVIO_API_TOKEN',
		{
			endpointTemplate: {
				slot: 'ENVIO_API_TOKEN',
			},
		},
		undefined,
	],
	[
		'["EnvioHyperSync_RawHttp","Eip155Chain","1","HttpProxy","EnvioHyperSyncApi"]',
		'ENVIO_API_TOKEN',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["GetBlockRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]',
		'GETBLOCK_API_KEY',
		{
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
		undefined,
	],
	[
		'["GetBlockYellowstone_Grpc","Caip2Network","solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp","RemoteLive","GrpcService"]',
		'GETBLOCK_API_KEY',
		{
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
		undefined,
	],
	[
		'["GoldRushFoundational_Rest","Eip155Chain","1","HttpProxy","GoldRushFoundationalApi"]',
		'COVALENT_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["LightningLnd_Rest","LocalDevice","lnd","HttpProxy","RestJson"]',
		'LND_MACAROON_HEX',
		{
			header: {
				name: 'Grpc-Metadata-macaroon',
			},
		},
		undefined,
	],
	[
		'["OpenAI_Rest","Global","openai-api","HttpProxy","RestJson"]',
		'OPENAI_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["OpenSea_Rest","Global","opensea-api","HttpProxy","OpenApiHttp"]',
		'OPENSEA_API_KEY',
		{
			header: {
				name: 'x-api-key',
			},
		},
		undefined,
	],
	[
		'["PythHermes_Rest","Global","pyth-hermes","HttpProxy","OpenApiHttp"]',
		'PYTH_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["Reddit_Rest","Global","oauth-api","HttpProxy","RestJson"]',
		'REDDIT_CLIENT_SECRET',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		{
			clientIdEnvKey: 'REDDIT_CLIENT_ID',
			tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
			userAgent: 'Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead',
		},
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","1","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","10","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","50","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","56","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","100","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","130","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","137","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","143","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","146","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","196","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","204","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","232","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","324","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","480","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","677","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","988","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","999","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","1001","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","1672","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","3338","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","4217","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","4326","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","4663","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","5000","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","5003","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","5042","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","8217","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","8453","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","9745","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","10143","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","10200","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","16661","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","25363","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","42161","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","42220","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","42431","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","43111","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","43114","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","46630","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","57073","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","59144","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","80069","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","80094","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","81224","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","84532","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","102030","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","534352","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","747474","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","5042002","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","11142220","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","11155111","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SafeTransactionService_Rest","Eip155Chain","1313161554","HttpProxy","RestJson"]',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
	[
		'["SpaceAndTime_MakeInfinite","Caip2Network","eip155:1","HttpProxy","RestJson"]',
		'MAKEINFINITE_API_KEY',
		{
			header: {
				name: 'apikey',
			},
		},
		undefined,
	],
	[
		'["Starkscan","NetworkSlug","starknet","HttpProxy","OpenApiHttp"]',
		'STARKSCAN_API_KEY',
		{
			header: {
				name: 'X-Starkscan-Api-Key',
			},
		},
		undefined,
	],
	[
		'["Tally","Global","tally-api","HttpProxy","GraphqlHttp"]',
		'TALLY_API_KEY',
		{
			header: {
				name: 'Api-Key',
			},
		},
		undefined,
	],
	[
		'["TonCenter","Caip2Network","ton:-239","HttpProxy","OpenApiHttp"]',
		'TONCENTER_MAINNET_API_KEY',
		{
			header: {
				name: 'X-API-Key',
			},
		},
		undefined,
	],
	[
		'["TonCenter","Caip2Network","ton:-3","HttpProxy","OpenApiHttp"]',
		'TONCENTER_TESTNET_API_KEY',
		{
			header: {
				name: 'X-API-Key',
			},
		},
		undefined,
	],
	[
		'["TronGrid_Rest","Caip2Network","tron:0x2b6653dc","HttpProxy","RestJson"]',
		'TRONGRID_API_KEY',
		{
			header: {
				name: 'TRON-PRO-API-KEY',
			},
		},
		undefined,
	],
	[
		'["TronScan_Rest","Caip2Network","tron:0x2b6653dc","HttpProxy","RestJson"]',
		'TRONSCAN_API_KEY',
		{
			header: {
				name: 'TRON-PRO-API-KEY',
			},
		},
		undefined,
	],
	[
		'["Voyager","NetworkSlug","starknet","HttpProxy","OpenApiHttp"]',
		'VOYAGER_API_KEY',
		{
			header: {
				name: 'x-api-key',
			},
		},
		undefined,
	],
	[
		'["X_Rest","Global","api-v2","HttpProxy","RestJson"]',
		'X_API_BEARER',
		{
			header: {
				name: 'Authorization',
				prefix: 'Bearer ',
			},
		},
		undefined,
	],
] as const satisfies readonly (readonly [
				bindingId: string,
				envKey: string,
				injection: SourceServerCredentialDefinition['injection'],
				oauthClientCredentials: SourceServerCredentialDefinition['oauthClientCredentials'],
			])[]

export default new Map<string, SourceServerCredentialDefinition>(
	runtimeSecretCredentials.map(([bindingId, envKey, injection, oauthClientCredentials]) => [
		bindingId,
		{
			envKey,
			injection,
			...(oauthClientCredentials == null ? {} : { oauthClientCredentials }),
		},
] satisfies readonly [string, SourceServerCredentialDefinition])
)
