import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	SidecarAccountBalanceInfo,
	SidecarBlock,
	SidecarRuntimeMetadata,
	SidecarStakingValidators,
} from '$/sources/SubstrateSidecar/Rest/types.ts'
import bindings from '$/sources/SubstrateSidecar/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SubstrateSidecar_Rest][0]

export const getBlock = ({
	blockId,
}: {
	blockId: bigint | string
}) => (
	getJson<SidecarBlock>(
		binding,
		`/blocks/${String(blockId)}`
	)
)

export const getAccountBalanceInfo = ({
	accountId,
}: {
	accountId: string
}) => {
	if (accountId.length === 0)
		throw new Error('SubstrateSidecar_Rest: account ID must not be empty')

	return getJson<SidecarAccountBalanceInfo>(
		binding,
		`/accounts/${encodeURIComponent(accountId)}/balance-info`
	)
}

export const getRuntimeMetadata = () => (
	getJson<SidecarRuntimeMetadata>(
		binding,
		'/runtime/metadata'
	)
)

export const getStakingValidators = () => (
	getJson<SidecarStakingValidators>(
		binding,
		'/pallets/staking/validators'
	)
)
