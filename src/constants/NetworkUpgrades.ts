// Types/constants
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { NetworkExecutionUpgradeLayer } from '$/schema/NetworkUpgradeProtocols.ts'
import {
	networkConsensusUpgrades as networkConsensusUpgradesList,
	networkExecutionUpgrades as networkExecutionUpgradesList,
	networkUpgrades as networkUpgradesList,
} from '$/constants/NetworkUpgradeEntityLists.ts'


// Constants
/** Execution / consensus codenames → umbrella `NetworkUpgrade.upgradeId` on paired L1 chains (1, Sepolia, Holesky). */
const ETHEREUM_MAINNET_NETWORK_UPGRADE_SLUG_ALIASES: Readonly<Record<string, string>> = {
	paris: 'Merge',
	bellatrix: 'Merge',
	merge: 'Merge',
	'the-merge': 'Merge',
	'the merge': 'Merge',
	shanghai: 'Shapella',
	capella: 'Shapella',
	cancun: 'Dencun',
	deneb: 'Dencun',
	prague: 'Pectra',
	electra: 'Pectra',
	osaka: 'Fusaka',
	fulu: 'Fusaka',
}

export const networkConsensusUpgrades = networkConsensusUpgradesList

export const networkExecutionUpgrades = networkExecutionUpgradesList

export const networkUpgrades = networkUpgradesList


// Functions
export const networkHasBlobParameterExecutionUpgrade = (chainId: number): boolean => (
	networkExecutionUpgradesList.some((executionUpgrade) => (
		executionUpgrade[EntityMetaKey.Id].$network.chainId === chainId
		&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
	))
)

const normalizeNetworkUpgradeSlugSegment = (segment: string): string => (
	segment.trim().toLowerCase().replace(/\s+/g, '-')
)

export const networkUpgradeIdFromChainIdAndUrlSegment = (
	chainId: number,
	segment: string,
): string | undefined => {
	const direct = networkUpgradesList.find((networkUpgrade) => {
		const id = networkUpgrade[EntityMetaKey.Id]
		if (id.$network.chainId !== chainId) return false
		const slugRaw = networkUpgrade.slug
		const slug = (
			typeof slugRaw === 'string' && slugRaw.length > 0 ?
				slugRaw
			:
				id.upgradeId.toLowerCase().replace(/\s+/g, '-')
		)
		const { upgradeId } = id
		return (
			segment === upgradeId
			|| segment === slug
			|| segment.toLowerCase() === upgradeId.toLowerCase()
			|| segment.toLowerCase() === slug.toLowerCase()
			|| normalizeNetworkUpgradeSlugSegment(segment) === normalizeNetworkUpgradeSlugSegment(slug)
			|| normalizeNetworkUpgradeSlugSegment(segment) === normalizeNetworkUpgradeSlugSegment(upgradeId)
		)
	})?.[EntityMetaKey.Id].upgradeId

	if (direct != null) {
		return direct
	}

	if (
		chainId === 1
		|| chainId === 11_155_111
		|| chainId === 17_000
	) {
		const aliasTarget = ETHEREUM_MAINNET_NETWORK_UPGRADE_SLUG_ALIASES[normalizeNetworkUpgradeSlugSegment(segment)]
		if (aliasTarget != null) {
			return (
				networkUpgradesList.find((networkUpgrade) => (
					networkUpgrade[EntityMetaKey.Id].$network.chainId === chainId
					&& networkUpgrade[EntityMetaKey.Id].upgradeId === aliasTarget
				))
				?.[EntityMetaKey.Id].upgradeId
			)
		}
	}

	return undefined
}


// Lookups
export const networkUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkUpgradesList.map((networkUpgrade) => [
		`${networkUpgrade[EntityMetaKey.Id].$network.chainId}:${networkUpgrade[EntityMetaKey.Id].upgradeId}`,
		networkUpgrade,
	]),
)

export const networkExecutionUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkExecutionUpgradesList.map((executionUpgrade) => [
		`${executionUpgrade[EntityMetaKey.Id].$network.chainId}:${executionUpgrade[EntityMetaKey.Id].upgradeId}`,
		executionUpgrade,
	]),
)

export const networkConsensusUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkConsensusUpgradesList.map((consensusUpgrade) => [
		`${consensusUpgrade[EntityMetaKey.Id].$network.chainId}:${consensusUpgrade[EntityMetaKey.Id].upgradeId}`,
		consensusUpgrade,
	]),
)
