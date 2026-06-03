import { getJson } from '$/lib/http.ts'
import CosmosSdk from '$/sources/CosmosSdk/index.ts'
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
		{ origins: CosmosSdk.origins  },
	)
)

export const getLatestBlock = ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => (
	getJson<CosmosSdkBlockResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/blocks/latest`,
		{ origins: CosmosSdk.origins  },
	)
)

export const getNodeInfo = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkNodeInfoResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/node_info`,
		{ origins: CosmosSdk.origins  },
	)
)

export const getSyncing = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkSyncingResponse>(
		`${base(restBaseUrl)}/cosmos/base/tendermint/v1beta1/syncing`,
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
	)
)

export const getValidators = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkValidatorsResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/validators?pagination.limit=24&pagination.count_total=true`,
		{ origins: CosmosSdk.origins  },
	)
)

export const getStakingPool = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkStakingPoolResponse>(
		`${base(restBaseUrl)}/cosmos/staking/v1beta1/pool`,
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
	)
)

export const getProposals = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<CosmosSdkProposalsResponse>(
		`${base(restBaseUrl)}/cosmos/gov/v1/proposals?pagination.limit=12&pagination.count_total=true`,
		{ origins: CosmosSdk.origins  },
	)
)

export const getDenomMetadata = ({
	restBaseUrl,
	denom,
}: {
	restBaseUrl: string
	denom: string
}) => (
	getJson<CosmosSdkDenomMetadataResponse>(
		`${base(restBaseUrl)}/cosmos/bank/v1beta1/denoms_metadata/${denom}`,
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
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
		{ origins: CosmosSdk.origins  },
	)
)
