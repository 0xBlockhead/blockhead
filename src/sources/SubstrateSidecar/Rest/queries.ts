import { getJson } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { substrateSidecarBindings } from '$/sources/SubstrateSidecar/bindings.ts'
import type {
	SidecarAccountBalanceInfo,
	SidecarBlock,
	SidecarRuntimeMetadata,
	SidecarStakingValidators,
} from '$/sources/SubstrateSidecar/Rest/types.ts'

export const substrateSidecarRestEndpoints = [
	{
		url: substrateSidecarBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'Local Substrate Sidecar',
	},
] as const

export const substrateSidecarOrigins = [
	...new Map(
		substrateSidecarBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

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
