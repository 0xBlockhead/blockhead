import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	SidecarAccountBalanceInfo,
	SidecarBlock,
	SidecarRuntimeMetadata,
	SidecarStakingValidators,
} from '$/sources/SubstrateSidecar/Rest/types.ts'

export const getBlock = ({
	binding,
	blockId,
}: {
	binding: SourceBinding
	blockId: bigint | string
}) => (
	getJson<SidecarBlock>(
		binding,
		`/blocks/${String(blockId)}`
	)
)

export const getAccountBalanceInfo = ({
	binding,
	accountId,
}: {
	binding: SourceBinding
	accountId: string
}) => (
	getJson<SidecarAccountBalanceInfo>(
		binding,
		`/accounts/${accountId}/balance-info`
	)
)

export const getRuntimeMetadata = ({ binding }: { binding: SourceBinding }) => (
	getJson<SidecarRuntimeMetadata>(
		binding,
		'/runtime/metadata'
	)
)

export const getStakingValidators = ({ binding }: { binding: SourceBinding }) => (
	getJson<SidecarStakingValidators>(
		binding,
		'/pallets/staking/validators'
	)
)
