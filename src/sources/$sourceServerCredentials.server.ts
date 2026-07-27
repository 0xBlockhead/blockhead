// Generated from APP.ts. Do not edit by hand.

import type { SourceServerCredentialDefinition } from '$/sources/SourceBinding.ts'

export default {
	'["Amboss_Graphql","Global","amboss-space","HttpProxy","GraphqlHttp"]': {
		envKey: 'AMBOSS_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["Blockfrost_Rest","Caip2Network","cip34:1-764824073","HttpProxy","OpenApiHttp"]': {
		envKey: 'BLOCKFROST_PROJECT_ID',
		injection: {
			header: {
				name: 'project_id',
			},
		},
	},
	'["EnvioHyperRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]': {
		envKey: 'ENVIO_API_TOKEN',
		injection: {
			endpointTemplate: {
				slot: 'ENVIO_API_TOKEN',
			},
		},
	},
	'["EnvioHyperSync_RawHttp","Eip155Chain","1","HttpProxy","EnvioHyperSyncApi"]': {
		envKey: 'ENVIO_API_TOKEN',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["GetBlockRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]': {
		envKey: 'GETBLOCK_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	},
	'["GetBlockYellowstone_Grpc","Caip2Network","solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp","RemoteLive","GrpcService"]': {
		envKey: 'GETBLOCK_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	},
	'["GoldRushFoundational_Rest","Eip155Chain","1","HttpProxy","GoldRushFoundationalApi"]': {
		envKey: 'COVALENT_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["OpenAI_Rest","Global","openai-api","HttpProxy","RestJson"]': {
		envKey: 'OPENAI_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["SafeTransactionService_Rest","Eip155Chain","1","HttpProxy","RestJson"]': {
		envKey: 'SAFE_TRANSACTION_SERVICE_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["SafeTransactionService_Rest","Eip155Chain","100","HttpProxy","RestJson"]': {
		envKey: 'SAFE_TRANSACTION_SERVICE_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["SafeTransactionService_Rest","Eip155Chain","8453","HttpProxy","RestJson"]': {
		envKey: 'SAFE_TRANSACTION_SERVICE_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'["SpaceAndTime_MakeInfinite","Caip2Network","eip155:1","HttpProxy","RestJson"]': {
		envKey: 'MAKEINFINITE_API_KEY',
		injection: {
			header: {
				name: 'apikey',
			},
		},
	},
	'["Tally_Graphql","Global","tally-api","HttpProxy","GraphqlHttp"]': {
		envKey: 'TALLY_API_KEY',
		injection: {
			header: {
				name: 'Api-Key',
			},
		},
	},
} as const satisfies Readonly<Record<string, SourceServerCredentialDefinition>>
