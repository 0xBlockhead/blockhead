// Generated from APP.ts. Do not edit by hand.

import type { SourceServerCredentialDefinition } from '$/sources/SourceBinding.ts'

export const sourceServerCredentialsById = {
	'Blockfrost_Rest-55': {
		envKey: 'BLOCKFROST_PROJECT_ID',
		injection: {
			header: {
				name: 'project_id',
			},
		},
	},
	'EnvioHyperRpc_JsonRpc-130': {
		envKey: 'ENVIO_API_TOKEN',
		injection: {
			endpointTemplate: {
				slot: 'ENVIO_API_TOKEN',
			},
		},
	},
	'EnvioHyperSync_RawHttp-131': {
		envKey: 'ENVIO_API_TOKEN',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'GetBlockRpc_JsonRpc-144': {
		envKey: 'GETBLOCK_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	},
	'GetBlockYellowstone_Grpc-145': {
		envKey: 'GETBLOCK_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	},
	'GoldRushFoundational_Rest-151': {
		envKey: 'COVALENT_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'OpenAI_Rest-236': {
		envKey: 'OPENAI_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
} as const satisfies Readonly<Record<string, SourceServerCredentialDefinition>>
