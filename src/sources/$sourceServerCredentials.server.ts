// Generated from APP.ts.

import { sourceBindings } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	sourceBindingId,
	SourceCredentialScope,
	type SourceServerCredentialDefinition,
} from '$/sources/SourceBinding.ts'

const runtimeSecretBindingCandidates = sourceBindings.filter(({ credentials }) => credentials.some(({ scope, keys }) => (
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
