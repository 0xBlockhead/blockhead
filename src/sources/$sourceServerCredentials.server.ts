// Generated from APP.ts.

import sourceProviders from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceCredentialScope,
	type SourceBinding,
	type SourceServerCredentialDefinition,
} from '$/sources/SourceBinding.ts'

const runtimeSecretBindingCandidates = sourceProviders
	.flatMap<SourceBinding>(({ bindings }) => bindings)
	.filter(({ credentials }) => credentials.some(({ scope, keys }) => (
		scope === SourceCredentialScope.RuntimeSecret
		&& keys == null
	)))

const runtimeSecretBinding = (
	source: Source,
	targetKey?: string
) => {
	const bindings = runtimeSecretBindingCandidates.filter((candidate) => (
		candidate.source === source
		&& (targetKey === undefined || candidate.target.key === targetKey)
	))
	const binding = bindings.at(0)
	if (binding == null || bindings.length > 1)
		throw new Error(`Expected one runtime-secret binding for ${source}${targetKey === undefined ? '' : ` target ${targetKey}`}`)

	return binding
}

export default new Map<
	string,
	SourceServerCredentialDefinition
>([
	[
		sourceBindingId(runtimeSecretBinding(Source.Amboss_Graphql)),
		{
			envKey: 'AMBOSS_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.Blockfrost_Rest)),
		{
			envKey: 'BLOCKFROST_PROJECT_ID',
			injection: {
				header: {
					name: 'project_id',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.EigenExplorer_Rest)),
		{
			envKey: 'EIGEN_EXPLORER_API_TOKEN',
			injection: {
				header: {
					name: 'x-api-token',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.EnvioHyperRpc_JsonRpc)),
		{
			envKey: 'ENVIO_API_TOKEN',
			injection: {
				endpointTemplate: {
					slot: 'ENVIO_API_TOKEN',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.EnvioHyperSync_RawHttp)),
		{
			envKey: 'ENVIO_API_TOKEN',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.GetBlockRpc_JsonRpc)),
		{
			envKey: 'GETBLOCK_API_KEY',
			injection: {
				endpointTemplate: {
					slot: 'GETBLOCK_API_KEY',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.GetBlockYellowstone_Grpc)),
		{
			envKey: 'GETBLOCK_API_KEY',
			injection: {
				endpointTemplate: {
					slot: 'GETBLOCK_API_KEY',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.GoldRushFoundational_Rest)),
		{
			envKey: 'COVALENT_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.OpenAI_Rest)),
		{
			envKey: 'OPENAI_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.PythHermes_Rest)),
		{
			envKey: 'PYTH_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.SafeTransactionService_Rest, '1')),
		{
			envKey: 'SAFE_TRANSACTION_SERVICE_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.SafeTransactionService_Rest, '100')),
		{
			envKey: 'SAFE_TRANSACTION_SERVICE_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.SafeTransactionService_Rest, '8453')),
		{
			envKey: 'SAFE_TRANSACTION_SERVICE_API_KEY',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.SpaceAndTime_MakeInfinite)),
		{
			envKey: 'MAKEINFINITE_API_KEY',
			injection: {
				header: {
					name: 'apikey',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.Starkscan)),
		{
			envKey: 'STARKSCAN_API_KEY',
			injection: {
				header: {
					name: 'X-Starkscan-Api-Key',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.Tally)),
		{
			envKey: 'TALLY_API_KEY',
			injection: {
				header: {
					name: 'Api-Key',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.TonCenter, 'ton:-239')),
		{
			envKey: 'TONCENTER_MAINNET_API_KEY',
			injection: {
				header: {
					name: 'X-API-Key',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.TonCenter, 'ton:-3')),
		{
			envKey: 'TONCENTER_TESTNET_API_KEY',
			injection: {
				header: {
					name: 'X-API-Key',
				},
			},
		},
	],
	[
		sourceBindingId(runtimeSecretBinding(Source.Voyager)),
		{
			envKey: 'VOYAGER_API_KEY',
			injection: {
				header: {
					name: 'x-api-key',
				},
			},
		},
	],
])
