import { getJson } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import type {
	SidecarAccountBalanceInfo,
	SidecarBlock,
	SidecarRuntimeMetadata,
	SidecarStakingValidators,
} from '$/sources/SubstrateSidecar/Rest/types.ts'

const substrateSidecarOrigin = 'http://127.0.0.1:8080' as const

export const substrateSidecarRestEndpoints = [
	{
		url: substrateSidecarOrigin,
		transportType: TransportType.Http,
		providerName: 'Local Substrate Sidecar',
	},
] as const

export const substrateSidecarOrigins = [
	{
		origin: substrateSidecarOrigin,
		corsEnabled: false,
	},
] as const

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')

export const getBlock = ({
	restBaseUrl,
	blockId,
}: {
	restBaseUrl: string
	blockId: bigint | string
}) => (
	getJson<SidecarBlock>(
		`${base(restBaseUrl)}/blocks/${String(blockId)}`,
		{ origins: substrateSidecarOrigins }
	)
)

export const getAccountBalanceInfo = ({
	restBaseUrl,
	accountId,
}: {
	restBaseUrl: string
	accountId: string
}) => (
	getJson<SidecarAccountBalanceInfo>(
		`${base(restBaseUrl)}/accounts/${accountId}/balance-info`,
		{ origins: substrateSidecarOrigins }
	)
)

export const getRuntimeMetadata = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<SidecarRuntimeMetadata>(
		`${base(restBaseUrl)}/runtime/metadata`,
		{ origins: substrateSidecarOrigins }
	)
)

export const getStakingValidators = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<SidecarStakingValidators>(
		`${base(restBaseUrl)}/pallets/staking/validators`,
		{ origins: substrateSidecarOrigins }
	)
)
