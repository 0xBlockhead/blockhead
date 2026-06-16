import { getJson } from '$/lib/http.ts'
import SubstrateSidecar from '$/sources/SubstrateSidecar/index.ts'
import type {
	SidecarAccountBalanceInfo,
	SidecarBlock,
	SidecarRuntimeMetadata,
	SidecarStakingValidators,
} from '$/sources/SubstrateSidecar/Rest/types.ts'

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
		{ origins: SubstrateSidecar.origins  }
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
		{ origins: SubstrateSidecar.origins  }
	)
)

export const getRuntimeMetadata = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<SidecarRuntimeMetadata>(
		`${base(restBaseUrl)}/runtime/metadata`,
		{ origins: SubstrateSidecar.origins  }
	)
)

export const getStakingValidators = ({ restBaseUrl }: { restBaseUrl: string }) => (
	getJson<SidecarStakingValidators>(
		`${base(restBaseUrl)}/pallets/staking/validators`,
		{ origins: SubstrateSidecar.origins  }
	)
)
