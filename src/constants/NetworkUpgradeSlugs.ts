// Types


// Constants

/** URL segment for a fork or umbrella `upgradeId` when no explicit `slug` override exists in activations. */
export const networkUpgradeSlugSegmentFromUpgradeId = (upgradeId: string): string => (
	String(upgradeId).trim().toLowerCase().replace(/\s+/g, '-')
)

/**
 * `NetworkUpgrade` marketing umbrella rows (Ethereum mainnet + aligned testnets): canonical `upgradeId` → URL slug.
 * @see `$/constants/NetworkUpgrades.ts` (`ethereumNetworkMarketingUmbrellas`)
 */
export const ethereumNetworkMarketingNetworkUpgradeSlugs = {
	Merge: 'merge',
	Shapella: 'shapella',
	Dencun: 'dencun',
	Pectra: 'pectra',
	Fusaka: 'fusaka',
} as const satisfies Record<string, string>

/**
 * Execution fork names used by those umbrellas: `NetworkExecutionUpgrade.upgradeId` → URL slug (routes / `[upgradeSlug]`).
 */
export const ethereumNetworkMarketingNetworkExecutionUpgradeSlugs = {
	Paris: 'paris',
	Shanghai: 'shanghai',
	Cancun: 'cancun',
	Prague: 'prague',
	Osaka: 'osaka',
} as const satisfies Record<string, string>

/**
 * Consensus fork names paired with those umbrellas: `NetworkConsensusUpgrade.upgradeId` → URL slug.
 */
export const ethereumNetworkMarketingNetworkConsensusUpgradeSlugs = {
	Bellatrix: 'bellatrix',
	Capella: 'capella',
	Deneb: 'deneb',
	Electra: 'electra',
	Fulu: 'fulu',
} as const satisfies Record<string, string>

/** Resolved slug for a `NetworkExecutionUpgrade` row (activation override → lookup → derived segment). */
export const networkExecutionUpgradeSlugFromParts = (args: {
	readonly upgradeId: string
	readonly slugOverride: string | undefined
}): string => (
	args.slugOverride
	?? networkExecutionUpgradeSlugByUpgradeId[args.upgradeId]
	?? networkUpgradeSlugSegmentFromUpgradeId(args.upgradeId)
)

/** Resolved slug for a `NetworkConsensusUpgrade` row. */
export const networkConsensusUpgradeSlugFromParts = (args: {
	readonly upgradeId: string
	readonly slugOverride: string | undefined
}): string => (
	args.slugOverride
	?? networkConsensusUpgradeSlugByUpgradeId[args.upgradeId]
	?? networkUpgradeSlugSegmentFromUpgradeId(args.upgradeId)
)

/** Resolved slug for a `NetworkUpgrade` row built from activations (not marketing umbrellas). */
export const networkUpgradeSlugFromParts = (args: {
	readonly upgradeId: string
	readonly slugOverride: string | undefined
}): string => (
	args.slugOverride
	?? networkUpgradeSlugSegmentFromUpgradeId(args.upgradeId)
)


// Lookups

export const ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId: Record<string, string> = (
	Object.fromEntries(
		Object.entries(ethereumNetworkMarketingNetworkUpgradeSlugs),
	)
)

export const networkExecutionUpgradeSlugByUpgradeId: Record<string, string> = {
	...ethereumNetworkMarketingNetworkExecutionUpgradeSlugs,
}

export const networkConsensusUpgradeSlugByUpgradeId: Record<string, string> = {
	...ethereumNetworkMarketingNetworkConsensusUpgradeSlugs,
}

