// Generated from APP.ts.

import { sourceBindings } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceCredentialScope,
	type SourceBinding,
	type SourceServerCredentialDefinition,
} from '$/sources/SourceBinding.ts'

const runtimeSecretBindingCandidates = sourceBindings.filter(({ credentials }: SourceBinding) => credentials.some(({
	keys,
	scope,
}) => (
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

const runtimeSecretCredentials = [
	[
		Source.Amboss_Graphql,
		undefined,
		'AMBOSS_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.Blockfrost_Rest,
		undefined,
		'BLOCKFROST_PROJECT_ID',
		{
			header: {
				name: 'project_id',
			},
		},
	],
	[
		Source.EigenExplorer_Rest,
		undefined,
		'EIGEN_EXPLORER_API_TOKEN',
		{
			header: {
				name: 'x-api-token',
			},
		},
	],
	[
		Source.EnvioHyperRpc_JsonRpc,
		undefined,
		'ENVIO_API_TOKEN',
		{
			endpointTemplate: {
				slot: 'ENVIO_API_TOKEN',
			},
		},
	],
	[
		Source.EnvioHyperSync_RawHttp,
		undefined,
		'ENVIO_API_TOKEN',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.GetBlockRpc_JsonRpc,
		undefined,
		'GETBLOCK_API_KEY',
		{
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	],
	[
		Source.GetBlockYellowstone_Grpc,
		undefined,
		'GETBLOCK_API_KEY',
		{
			endpointTemplate: {
				slot: 'GETBLOCK_API_KEY',
			},
		},
	],
	[
		Source.GoldRushFoundational_Rest,
		undefined,
		'COVALENT_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.OpenAI_Rest,
		undefined,
		'OPENAI_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.PythHermes_Rest,
		undefined,
		'PYTH_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'1',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'10',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'50',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'56',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'100',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'130',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'137',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'143',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'146',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'196',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'204',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'232',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'324',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'480',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'677',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'988',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'999',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'1001',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'1672',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'3338',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'4217',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'4326',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'4663',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'5000',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'5003',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'5042',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'8217',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'8453',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'9745',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'10143',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'10200',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'16661',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'25363',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'42161',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'42220',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'42431',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'43111',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'43114',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'46630',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'57073',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'59144',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'80069',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'80094',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'81224',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'84532',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'102030',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'534352',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'747474',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'5042002',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'11142220',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'11155111',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SafeTransactionService_Rest,
		'1313161554',
		'SAFE_TRANSACTION_SERVICE_API_KEY',
		{
			header: {
				name: 'authorization',
				prefix: 'Bearer ',
			},
		},
	],
	[
		Source.SpaceAndTime_MakeInfinite,
		undefined,
		'MAKEINFINITE_API_KEY',
		{
			header: {
				name: 'apikey',
			},
		},
	],
	[
		Source.Starkscan,
		undefined,
		'STARKSCAN_API_KEY',
		{
			header: {
				name: 'X-Starkscan-Api-Key',
			},
		},
	],
	[
		Source.Tally,
		undefined,
		'TALLY_API_KEY',
		{
			header: {
				name: 'Api-Key',
			},
		},
	],
	[
		Source.TonCenter,
		'ton:-239',
		'TONCENTER_MAINNET_API_KEY',
		{
			header: {
				name: 'X-API-Key',
			},
		},
	],
	[
		Source.TonCenter,
		'ton:-3',
		'TONCENTER_TESTNET_API_KEY',
		{
			header: {
				name: 'X-API-Key',
			},
		},
	],
	[
		Source.TronGrid_Rest,
		undefined,
		'TRONGRID_API_KEY',
		{
			header: {
				name: 'TRON-PRO-API-KEY',
			},
		},
	],
	[
		Source.TronScan_Rest,
		undefined,
		'TRONSCAN_API_KEY',
		{
			header: {
				name: 'TRON-PRO-API-KEY',
			},
		},
	],
	[
		Source.Voyager,
		undefined,
		'VOYAGER_API_KEY',
		{
			header: {
				name: 'x-api-key',
			},
		},
	],
] as const satisfies readonly (readonly [
	source: Source,
	targetKey: string | undefined,
	envKey: string,
	injection: SourceServerCredentialDefinition['injection'],
])[]

export default new Map<
	string,
	SourceServerCredentialDefinition
>(runtimeSecretCredentials.map(([
	source,
	targetKey,
	envKey,
	injection,
]) => [
	sourceBindingId(runtimeSecretBinding(source, targetKey)),
	{
		envKey,
		injection,
	},
] satisfies readonly [string, SourceServerCredentialDefinition]))
