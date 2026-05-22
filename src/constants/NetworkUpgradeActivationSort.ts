/**
 * Synchronous activation sort keys for `EntitiesList` on network upgrade rows.
 *
 * Resolver enrichment (`Constants.ts`) may async-fill `activationTimestamp` from RPC;
 * these helpers mirror that priority with catalog lookups and EVM/beacon heuristics so
 * lists sort correctly before enrichment settles or when RPC is unavailable.
 *
 * Sort convention: return a string for `getSortValue` (newest activation first via
 * `Number.MAX_SAFE_INTEGER - seconds` padding + `\0` tie-break). `UnorderedList`
 * sorts ascending on `getSortValue`, so larger activations get smaller keys.
 */

// Types
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import {
	networkConsensusUpgradeByChainIdAndUpgradeId,
	networkConsensusUpgrades,
	networkExecutionUpgradeByChainIdAndUpgradeId,
	networkExecutionUpgrades,
	networkUpgrades,
	resolveNetworkUpgradeDenormalizedFields,
} from '$/constants/NetworkUpgrades.ts'

type NetworkUpgradeRow = (typeof networkUpgrades)[number]
type NetworkExecutionUpgradeRow = (typeof networkExecutionUpgrades)[number]
type NetworkConsensusUpgradeRow = (typeof networkConsensusUpgrades)[number]


type NetworkUpgradeActivationSlice = {
	activationTimestamp?: number
	activationBlock?: number
	activationEpoch?: number
}


// Constants
/** Ethereum beacon spec: 32 twelve-second slots per epoch. */
const BEACON_SECONDS_PER_EPOCH = 32 * 12

/** Post-merge execution target; also used as a block→time heuristic when RPC enrichment is missing. */
const EXECUTION_SECONDS_PER_BLOCK = 12

/**
 * Execution-layer genesis unix seconds for chains in `NetworkUpgrades.ts`.
 * Block-only activations (historical L1 forks) map to `genesis + block × 12s`.
 */
const executionGenesisTimestampSecondsByChainId: Readonly<Record<number, number>> = {
	1: 1_438_269_973,
	10: 1_686_356_600,
	8453: 1_687_894_407,
	17_000: 1_695_900_000,
	84_532: 1_696_902_000,
	11_155_111: 1_633_267_481,
	11_155_420: 1_696_902_000,
}

/**
 * Beacon genesis unix seconds (slot 0) for paired consensus chains.
 * Epoch-only activations map to `genesis + epoch × 384s`.
 */
const beaconGenesisTimestampSecondsByChainId: Readonly<Record<number, number>> = {
	1: 1_606_824_023,
	17_000: 1_695_924_000,
	11_155_111: 1_656_747_600,
}


// Functions
const activationTimestampSecondsForSort = (
	activationTimestamp: number,
): number => (
	activationTimestamp < 1e12 ?
		activationTimestamp
	:
		Math.floor(activationTimestamp / 1000)
)

const activationSortSecondsFromFields = (
	chainId: number,
	fields: NetworkUpgradeActivationSlice,
): number => {
	if (fields.activationTimestamp != null) {
		return activationTimestampSecondsForSort(fields.activationTimestamp)
	}
	if (fields.activationBlock != null) {
		const executionGenesisTimestampSeconds = executionGenesisTimestampSecondsByChainId[chainId]
		return (
			executionGenesisTimestampSeconds != null ?
				executionGenesisTimestampSeconds + fields.activationBlock * EXECUTION_SECONDS_PER_BLOCK
			:
				fields.activationBlock * EXECUTION_SECONDS_PER_BLOCK
		)
	}
	if (fields.activationEpoch != null) {
		const beaconGenesisTimestampSeconds = beaconGenesisTimestampSecondsByChainId[chainId]
		const epochOffsetSeconds = fields.activationEpoch * BEACON_SECONDS_PER_EPOCH
		return (
			beaconGenesisTimestampSeconds != null ?
				beaconGenesisTimestampSeconds + epochOffsetSeconds
			:
				epochOffsetSeconds
		)
	}
	return 0
}

const entitiesListSortValueFromActivationSeconds = (
	activationSortSeconds: number,
	tieBreak: string,
): string => (
	`${String(Number.MAX_SAFE_INTEGER - activationSortSeconds).padStart(20, '0')}\0${tieBreak}`
)

const activationSortSecondsFromFieldSlices = (
	chainId: number,
	fieldSlices: NetworkUpgradeActivationSlice[],
): number => (
	Math.max(
		0,
		...fieldSlices.map((fields) => (
			activationSortSecondsFromFields(
				chainId,
				fields,
			)
		)),
	)
)

const networkUpgradeActivationFieldSlices = (
	row: NetworkUpgradeRow,
): NetworkUpgradeActivationSlice[] => {
	const fieldSlices: NetworkUpgradeActivationSlice[] = [
		row,
		resolveNetworkUpgradeDenormalizedFields(row),
	]
	if (row.$networkExecutionUpgrade != null) {
		const executionUpgradeId = row.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId
		const executionUpgradeChainId = row.$networkExecutionUpgrade[EntityMetaKey.Id].$network.chainId
		const executionUpgradeRow = networkExecutionUpgradeByChainIdAndUpgradeId[
			`${executionUpgradeChainId}:${executionUpgradeId}`
		]
		if (executionUpgradeRow != null) {
			fieldSlices.push(executionUpgradeRow)
		}
	}
	if (row.$networkConsensusUpgrade != null) {
		const consensusUpgradeId = row.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId
		const consensusUpgradeChainId = row.$networkConsensusUpgrade[EntityMetaKey.Id].$network.chainId
		const consensusUpgradeRow = networkConsensusUpgradeByChainIdAndUpgradeId[
			`${consensusUpgradeChainId}:${consensusUpgradeId}`
		]
		if (consensusUpgradeRow != null) {
			fieldSlices.push(consensusUpgradeRow)
		}
	}
	return fieldSlices
}

export const networkUpgradeEntitiesListSortValue = (
	row: NetworkUpgradeRow,
): string => (
	entitiesListSortValueFromActivationSeconds(
		activationSortSecondsFromFieldSlices(
			row[EntityMetaKey.Id].$network.chainId,
			networkUpgradeActivationFieldSlices(row),
		),
		row[EntityMetaKey.Id].upgradeId,
	)
)

export const networkExecutionUpgradeEntitiesListSortValue = (
	row: NetworkExecutionUpgradeRow,
): string => {
	const chainId = row[EntityMetaKey.Id].$network.chainId
	const upgradeId = row[EntityMetaKey.Id].upgradeId
	const catalogRow = networkExecutionUpgradeByChainIdAndUpgradeId[`${chainId}:${upgradeId}`]
	return entitiesListSortValueFromActivationSeconds(
		activationSortSecondsFromFieldSlices(
			chainId,
			[
				row,
				...(catalogRow == null ? [] : [catalogRow]),
			],
		),
		upgradeId,
	)
}

export const networkConsensusUpgradeEntitiesListSortValue = (
	row: NetworkConsensusUpgradeRow,
): string => {
	const chainId = row[EntityMetaKey.Id].$network.chainId
	const upgradeId = row[EntityMetaKey.Id].upgradeId
	const catalogRow = networkConsensusUpgradeByChainIdAndUpgradeId[`${chainId}:${upgradeId}`]
	return entitiesListSortValueFromActivationSeconds(
		activationSortSecondsFromFieldSlices(
			chainId,
			[
				row,
				...(catalogRow == null ? [] : [catalogRow]),
			],
		),
		upgradeId,
	)
}
