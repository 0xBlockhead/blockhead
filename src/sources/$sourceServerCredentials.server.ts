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
	'EnvioHyperRpc_JsonRpc-129': {
		envKey: 'ENVIO_API_TOKEN',
		injection: {
			endpointTemplate: {
				slot: 'ENVIO_API_TOKEN',
			},
		},
	},
	'EnvioHyperSync_RawHttp-130': {
		envKey: 'ENVIO_API_TOKEN',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'GetBlockRpc_JsonRpc-143': {
		envKey: 'GETBLOCK_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	},
	'GetBlockYellowstone_Grpc-144': {
		envKey: 'GETBLOCK_API_KEY',
		injection: {
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	},
	'GoldRushFoundational_Rest-150': {
		envKey: 'COVALENT_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'OpenAI_Rest-237': {
		envKey: 'OPENAI_API_KEY',
		injection: {
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	},
	'SpaceAndTime_MakeInfinite-277': {
		envKey: 'MAKEINFINITE_API_KEY',
		injection: {
			header: {
				name: 'apikey',
			},
		},
	},
} as const satisfies Readonly<Record<string, SourceServerCredentialDefinition>>
