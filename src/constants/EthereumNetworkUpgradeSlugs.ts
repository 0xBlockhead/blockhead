// Types

export type NetworkUpgradeSlugRow = {
	readonly upgradeId: string
	readonly slug: string
}


// Constants

/**
 * `NetworkUpgrade` marketing umbrella rows (Ethereum mainnet + aligned testnets).
 * @see `$/constants/EthereumNetworkUpgrades.ts` (`ethereumNetworkMarketingUmbrellas`)
 */
const ethereumNetworkMarketingNetworkUpgradeSlugs = [
	{ upgradeId: 'Merge', slug: 'merge' },
	{ upgradeId: 'Shapella', slug: 'shapella' },
	{ upgradeId: 'Dencun', slug: 'dencun' },
	{ upgradeId: 'Pectra', slug: 'pectra' },
	{ upgradeId: 'Fusaka', slug: 'fusaka' },
] as const satisfies readonly NetworkUpgradeSlugRow[]

/**
 * Execution fork names used by those umbrellas: `NetworkExecutionUpgrade.upgradeId` → URL slug.
 */
const ethereumNetworkMarketingNetworkExecutionUpgradeSlugs = [
	{ upgradeId: 'Paris', slug: 'paris' },
	{ upgradeId: 'Shanghai', slug: 'shanghai' },
	{ upgradeId: 'Cancun', slug: 'cancun' },
	{ upgradeId: 'Prague', slug: 'prague' },
	{ upgradeId: 'Osaka', slug: 'osaka' },
] as const satisfies readonly NetworkUpgradeSlugRow[]

/**
 * Consensus fork names paired with those umbrellas: `NetworkConsensusUpgrade.upgradeId` → URL slug.
 */
const ethereumNetworkMarketingNetworkConsensusUpgradeSlugs = [
	{ upgradeId: 'Bellatrix', slug: 'bellatrix' },
	{ upgradeId: 'Capella', slug: 'capella' },
	{ upgradeId: 'Deneb', slug: 'deneb' },
	{ upgradeId: 'Electra', slug: 'electra' },
	{ upgradeId: 'Fulu', slug: 'fulu' },
] as const satisfies readonly NetworkUpgradeSlugRow[]


// Lookups

export const ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId = Object.fromEntries(
	ethereumNetworkMarketingNetworkUpgradeSlugs.map((row) => [
		row.upgradeId,
		row,
	])
)

export const networkExecutionUpgradeSlugByUpgradeId = Object.fromEntries(
	ethereumNetworkMarketingNetworkExecutionUpgradeSlugs.map((row) => [
		row.upgradeId,
		row,
	])
)

export const networkConsensusUpgradeSlugByUpgradeId = Object.fromEntries(
	ethereumNetworkMarketingNetworkConsensusUpgradeSlugs.map((row) => [
		row.upgradeId,
		row,
	])
)
