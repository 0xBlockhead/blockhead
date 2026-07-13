import { getJson } from '$/lib/http.ts'
import { cosmosSdkOrigins } from '$/sources/CosmosSdk/index.ts'
import type {
	CosmosSdkAccountResponse,
	CosmosSdkBalancesResponse,
	CosmosSdkBlockResponse,
	CosmosSdkContractInfoResponse,
	CosmosSdkDenomMetadataResponse,
	CosmosSdkModuleAccountResponse,
	CosmosSdkNodeInfoResponse,
	CosmosSdkProposalResponse,
	CosmosSdkProposalsResponse,
	CosmosSdkStakingPoolResponse,
	CosmosSdkSyncingResponse,
	CosmosSdkTxResponse,
	CosmosSdkValidatorResponse,
	CosmosSdkValidatorsResponse,
} from '$/sources/CosmosSdk/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getBlock = ({
	restBaseUrl,
	height,
}: {
	restBaseUrl: string
	height: bigint
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getLatestBlock = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/blocks/latest`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getNodeInfo = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkNodeInfoResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/node_info`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getSyncing = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkSyncingResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/syncing`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getTx = ({
	restBaseUrl,
	txHash,
}: {
	restBaseUrl: string
	txHash: string
}) => (
	getJson<CosmosSdkTxResponse>(
		`${base(restBaseUrl)}/cosmos/tx/v1beta1/txs/${txHash}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getValidators = ({
	restBaseUrl,
	limit = 24,
	status,
}: {
	restBaseUrl: string
	limit?: number
	status?: string
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
		...(status != null && { status }),
	})

	return getJson<CosmosSdkValidatorsResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/validators?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getStakingPool = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkStakingPoolResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/pool`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getValidator = ({
	restBaseUrl,
	operatorAddress,
}: {
	restBaseUrl: string
	operatorAddress: string
}) => (
	getJson<CosmosSdkValidatorResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/validators/${operatorAddress}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getAccount = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<CosmosSdkAccountResponse>(
		`${base(restBaseUrl)}/cosmos/auth/v1beta1/accounts/${address}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getProposal = ({
	restBaseUrl,
	proposalId,
}: {
	restBaseUrl: string
	proposalId: string
}) => (
	getJson<CosmosSdkProposalResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals/${proposalId}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getProposals = ({
	restBaseUrl,
	limit = 12,
}: {
	restBaseUrl: string
	limit?: number
}) => {
	const parameters = new URLSearchParams({
		'pagination.limit': String(limit),
		'pagination.count_total': 'true',
	})

	return getJson<CosmosSdkProposalsResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals?${parameters}`,
		{ origins: cosmosSdkOrigins }
	)
}

export const getDenomMetadata = ({
	restBaseUrl,
	denom,
}: {
	restBaseUrl: string
	denom: string
}) => (
	getJson<CosmosSdkDenomMetadataResponse>(
		`${base(restBaseUrl)}/cosmos/bank/v1beta1/denoms_metadata/${denom}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getModuleAccount = ({
	restBaseUrl,
	moduleName,
}: {
	restBaseUrl: string
	moduleName: string
}) => (
	getJson<CosmosSdkModuleAccountResponse>(
		`${base(restBaseUrl)}/cosmos/auth/v1beta1/module_accounts/${moduleName}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getBalances = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<CosmosSdkBalancesResponse>(
		`${base(restBaseUrl)}/cosmos/bank/v1beta1/balances/${address}`,
		{ origins: cosmosSdkOrigins }
	)
)

export const getContractInfo = ({
	restBaseUrl,
	address,
}: {
	restBaseUrl: string
	address: string
}) => (
	getJson<CosmosSdkContractInfoResponse>(
		`${base(restBaseUrl)}/cosmwasm/wasm/v1/contract/${address}`,
		{ origins: cosmosSdkOrigins }
	)
)
