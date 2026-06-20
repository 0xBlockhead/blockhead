/**
	* `NetworkUpgrade` ties a catalog / marketing id to a `NetworkExecutionUpgrade` and optionally a
	* `NetworkConsensusUpgrade` when both layers shipped under one name (e.g. umbrella labels on L1).
	* Consensus-only forks (beacon-only activations) are listed only on `Network.$$consensusUpgrades`, not here.
	* @see https://ethereum.org/en/history/
	*/

import {
	ExecutionProtocol,
	NetworkExecutionUpgradeLayer,
} from '$/schema/NetworkUpgradeProtocols.ts'
import {
	baseMainnetNetworkUpgradeActivations,
	baseSepoliaNetworkUpgradeActivations,
	ethereumMainnetNetworkUpgradeActivations,
	holeskyNetworkUpgradeActivations,
	opMainnetNetworkUpgradeActivations,
	opSepoliaNetworkUpgradeActivations,
	sepoliaNetworkUpgradeActivations,
	type NetworkUpgradeActivation,
} from '$/constants/EthereumNetworkUpgradeActivations.ts'
import {
	ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId,
	networkConsensusUpgradeSlugByUpgradeId,
	networkExecutionUpgradeSlugByUpgradeId,
} from '$/constants/EthereumNetworkUpgradeSlugs.ts'

/**
	* Manual dual-layer marketing umbrellas (Merge, Shapella, …).
	* `chainId` is applied when expanding to per-chain rows.
	*/
export type NetworkUpgradeMarketingUmbrellaTemplate = {
	readonly upgradeId: string
	readonly name: string
	readonly slug: string
	readonly executionUpgradeId: string
	readonly consensusUpgradeId: string
}

export type NetworkExecutionUpgradeRow = {
	readonly chainId: number
	readonly upgradeId: string
	readonly name: string
	readonly slug: string
	readonly protocol: ExecutionProtocol
	readonly layer?: NetworkExecutionUpgradeLayer
	readonly activationBlock?: number
	readonly activationTimestampMs?: number
	readonly activationEpoch?: number
	readonly forkHash?: string
	readonly linkEthereumOrg?: string
	readonly linkExecutionDocs?: string
	readonly executionSpecsPinnedMarkdownFilename?: string
	readonly linkForkcast?: string
	readonly proposalIds?: NonNullable<NetworkUpgradeActivation['proposalIds']>
}

export type NetworkConsensusUpgradeRow = {
	readonly chainId: number
	readonly upgradeId: string
	readonly name: string
	readonly slug: string
	readonly protocol: NonNullable<NetworkUpgradeActivation['consensusProtocol']>
	readonly activationBlock?: number
	readonly activationTimestampMs?: number
	readonly activationEpoch?: number
	readonly linkEthereumOrg?: string
	readonly linkConsensusDocs?: string
	readonly linkForkcast?: string
	readonly proposalIds?: NonNullable<NetworkUpgradeActivation['proposalIds']>
}

export type NetworkUpgradeRow = {
	readonly chainId: number
	readonly upgradeId: string
	readonly name: string
	readonly slug: string
	readonly executionUpgradeId: string
	readonly consensusUpgradeId?: string
}


// Constants

const upgradeIdSlugSegment = (upgradeId: string): string => (
	String(upgradeId).toLowerCase().replace(/\s+/g, '-')
)

const networkExecutionUpgradeSlugFromParts = (args: {
	readonly upgradeId: string
	readonly slugOverride: string | undefined
}): string => (
	args.slugOverride
	?? networkExecutionUpgradeSlugByUpgradeId[args.upgradeId]?.slug
	?? upgradeIdSlugSegment(args.upgradeId)
)

const networkConsensusUpgradeSlugFromParts = (args: {
	readonly upgradeId: string
	readonly slugOverride: string | undefined
}): string => (
	args.slugOverride
	?? networkConsensusUpgradeSlugByUpgradeId[args.upgradeId]?.slug
	?? upgradeIdSlugSegment(args.upgradeId)
)

const networkUpgradeSlugFromParts = (args: {
	readonly upgradeId: string
	readonly slugOverride: string | undefined
}): string => (
	args.slugOverride
	?? upgradeIdSlugSegment(args.upgradeId)
)

/** Canonical `*.md` under pinned `ethereum/execution-specs/.../network-upgrades/mainnet-upgrades/`. */
const executionSpecsPinnedMarkdownFilenameFromLink = (
	executionSpecsLink: string | undefined
): string | undefined => {
	if (executionSpecsLink == null) return undefined
	const pathOnly = executionSpecsLink.split('?')[0]
	if (!pathOnly.includes('ethereum/execution-specs')) return undefined
	if (!pathOnly.includes('network-upgrades/mainnet-upgrades')) return undefined
	const segments = pathOnly.split('/')
	const lastSegment = segments[segments.length - 1]
	if (!lastSegment.endsWith('.md')) return undefined
	return /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.md$/.test(lastSegment) ? lastSegment : undefined
}

export const ethereumNetworkMarketingUmbrellas = [
	{
		upgradeId: 'Merge',
		name: 'The Merge',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Merge'].slug,
		executionUpgradeId: 'Paris',
		consensusUpgradeId: 'Bellatrix',
	},
	{
		upgradeId: 'Shapella',
		name: 'Shapella',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Shapella'].slug,
		executionUpgradeId: 'Shanghai',
		consensusUpgradeId: 'Capella',
	},
	{
		upgradeId: 'Dencun',
		name: 'Dencun',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Dencun'].slug,
		executionUpgradeId: 'Cancun',
		consensusUpgradeId: 'Deneb',
	},
	{
		upgradeId: 'Pectra',
		name: 'Pectra',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Pectra'].slug,
		executionUpgradeId: 'Prague',
		consensusUpgradeId: 'Electra',
	},
	{
		upgradeId: 'Fusaka',
		name: 'Fusaka',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Fusaka'].slug,
		executionUpgradeId: 'Osaka',
		consensusUpgradeId: 'Fulu',
	},
] as const satisfies readonly NetworkUpgradeMarketingUmbrellaTemplate[]


/** L1 / public testnets where merge-era umbrella ids (Merge, Shapella, …) subsume separate execution and consensus fork names into one NetworkUpgrade row. */
const ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS = new Set<number>([
	1,
	11_155_111,
	17_000,
])

const activationFieldsFromActivation = (
	activation: NetworkUpgradeActivation['activation']
) => (
	activation == null ?
		{}
	:
		{
			...(activation.block != null && { activationBlock: activation.block }),
			...(activation.timestamp != null && {
				activationTimestampMs: (
					activation.timestamp < 1e12 ?
						activation.timestamp * 1000
					:
						activation.timestamp
				),
			}),
			...(activation.epoch != null && { activationEpoch: activation.epoch }),
		}
)

const maxActivationTimestamp = (
	...timestamps: (number | undefined)[]
): number | undefined => {
	const defined = timestamps.filter((timestamp): timestamp is number => timestamp != null)
	return (
		defined.length > 0 ?
			Math.max(...defined)
		:
			undefined
	)
}

const networkExecutionUpgradeRowFromActivation = (
	chainId: number,
	activationSource: NetworkUpgradeActivation
): NetworkExecutionUpgradeRow | null => {
	if (
		activationSource.consensusProtocol != null
		&& activationSource.executionProtocol == null
		&& activationSource.blobParameterOnly !== true
	) {
		return null
	}
	const {
		upgradeId,
		name,
		slug: slugMaybe,
		activation,
		links,
		proposalIds,
		forkHash,
	} = activationSource
	const slugValue = networkExecutionUpgradeSlugFromParts({
		upgradeId,
		slugOverride: slugMaybe,
	})
	const pinnedFilename = executionSpecsPinnedMarkdownFilenameFromLink(links?.executionSpecs)
	if (activationSource.blobParameterOnly === true)
		return {
			chainId,
			upgradeId,
			name: name ?? upgradeId,
			slug: slugValue,
			layer: NetworkExecutionUpgradeLayer.Blob,
			protocol: ExecutionProtocol.OpStack,
			...activationFieldsFromActivation(activation),
			...(forkHash != null && { forkHash }),
			...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
			...(links?.executionSpecs != null && { linkExecutionDocs: links.executionSpecs }),
			...(pinnedFilename != null && { executionSpecsPinnedMarkdownFilename: pinnedFilename }),
			...(links?.forkcast != null && { linkForkcast: links.forkcast }),
			...(proposalIds != null && proposalIds.length > 0 && { proposalIds }),
		} satisfies NetworkExecutionUpgradeRow
	if (activationSource.executionProtocol == null)
		return null
	return {
		chainId,
		upgradeId,
		name: name ?? upgradeId,
		slug: slugValue,
		protocol: activationSource.executionProtocol,
		...activationFieldsFromActivation(activation),
		...(forkHash != null && { forkHash }),
		...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
		...(links?.executionSpecs != null && { linkExecutionDocs: links.executionSpecs }),
		...(pinnedFilename != null && { executionSpecsPinnedMarkdownFilename: pinnedFilename }),
		...(links?.forkcast != null && { linkForkcast: links.forkcast }),
		...(proposalIds != null && proposalIds.length > 0 && { proposalIds }),
	} satisfies NetworkExecutionUpgradeRow
}

const networkConsensusUpgradeRowFromActivation = (
	chainId: number,
	activationSource: NetworkUpgradeActivation
): NetworkConsensusUpgradeRow | null => {
	if (activationSource.consensusProtocol == null)
		return null
	const {
		upgradeId,
		name,
		slug: slugMaybe,
		activation,
		links,
		proposalIds,
	} = activationSource
	return {
		chainId,
		upgradeId,
		name: name ?? upgradeId,
		slug: networkConsensusUpgradeSlugFromParts({
			upgradeId,
			slugOverride: slugMaybe,
		}),
		protocol: activationSource.consensusProtocol,
		...activationFieldsFromActivation(activation),
		...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
		...(links?.consensusSpecs != null && { linkConsensusDocs: links.consensusSpecs }),
		...(links?.forkcast != null && { linkForkcast: links.forkcast }),
		...(proposalIds != null && proposalIds.length > 0 && { proposalIds }),
	} satisfies NetworkConsensusUpgradeRow
}

const networkUpgradeRowFromActivation = (
	chainId: number,
	activationSource: NetworkUpgradeActivation
): NetworkUpgradeRow | null => {
	const hasExecution = (
		activationSource.blobParameterOnly === true
		|| activationSource.executionProtocol != null
	)
	const hasConsensus = activationSource.consensusProtocol != null
	if (!hasExecution)
		return null
	const {
		upgradeId,
		name,
		slug: slugMaybe,
	} = activationSource
	return {
		chainId,
		upgradeId,
		name: name ?? upgradeId,
		slug: networkUpgradeSlugFromParts({
			upgradeId,
			slugOverride: slugMaybe,
		}),
		executionUpgradeId: upgradeId,
		...(hasConsensus && { consensusUpgradeId: upgradeId }),
	} satisfies NetworkUpgradeRow
}

const activationsWithChainId = (
	chainId: number,
	activations: readonly NetworkUpgradeActivation[]
): {
	chainId: number
	activationSource: NetworkUpgradeActivation
}[] => (
	activations.map((activationSource) => ({
		chainId,
		activationSource,
	}))
)

const withChain = [
	...activationsWithChainId(1, ethereumMainnetNetworkUpgradeActivations),
	...activationsWithChainId(10, opMainnetNetworkUpgradeActivations),
	...activationsWithChainId(8453, baseMainnetNetworkUpgradeActivations),
	...activationsWithChainId(17_000, holeskyNetworkUpgradeActivations),
	...activationsWithChainId(84_532, baseSepoliaNetworkUpgradeActivations),
	...activationsWithChainId(11_155_111, sepoliaNetworkUpgradeActivations),
	...activationsWithChainId(11_155_420, opSepoliaNetworkUpgradeActivations),
]

const chainIdsWithUpgradeActivations = (
	[...new Set(withChain.map(({ chainId }) => chainId))].toSorted((a, b) => a - b)
)

const networkExecutionUpgradesBuilt = (
	withChain
		.map(({ chainId, activationSource }) => networkExecutionUpgradeRowFromActivation(chainId, activationSource))
		.filter((entity): entity is NetworkExecutionUpgradeRow => entity != null)
)

const networkConsensusUpgradesBuilt = (
	withChain
		.map(({ chainId, activationSource }) => networkConsensusUpgradeRowFromActivation(chainId, activationSource))
		.filter((entity): entity is NetworkConsensusUpgradeRow => entity != null)
)

const umbrellaSubsumedUpgradeIdsByChain = new Map<number, Set<string>>()

for (const chainId of chainIdsWithUpgradeActivations) {
	if (!ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS.has(chainId)) {
		umbrellaSubsumedUpgradeIdsByChain.set(chainId, new Set())
		continue
	}
	const subsumedOnChain = new Set<string>()
	for (const definition of ethereumNetworkMarketingUmbrellas) {
		subsumedOnChain.add(definition.executionUpgradeId)
		subsumedOnChain.add(definition.consensusUpgradeId)
	}
	umbrellaSubsumedUpgradeIdsByChain.set(chainId, subsumedOnChain)
}

const networkUpgradeMarketingUmbrellas = (
	[...ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS].toSorted((a, b) => a - b)
		.filter((chainId) => chainIdsWithUpgradeActivations.includes(chainId))
		.flatMap((chainId) => (
			ethereumNetworkMarketingUmbrellas.map((definition) => ({
				chainId,
				upgradeId: definition.upgradeId,
				name: definition.name,
				slug: definition.slug,
				executionUpgradeId: definition.executionUpgradeId,
				consensusUpgradeId: definition.consensusUpgradeId,
			}))
		))
)

const standaloneNetworkUpgrades = (
	withChain
		.map(({ chainId, activationSource }) => {
			if (
				ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS.has(chainId)
				&& umbrellaSubsumedUpgradeIdsByChain.get(chainId)?.has(activationSource.upgradeId) === true
			) {
				return null
			}
			return networkUpgradeRowFromActivation(chainId, activationSource)
		})
		.filter((entity): entity is NetworkUpgradeRow => entity != null)
)

const networkUpgradesBuilt = [
	...standaloneNetworkUpgrades,
	...networkUpgradeMarketingUmbrellas,
]

export const networkExecutionUpgrades = networkExecutionUpgradesBuilt

export const networkConsensusUpgrades = networkConsensusUpgradesBuilt

export const networkUpgrades = networkUpgradesBuilt

/** Execution / consensus codename aliases → umbrella `NetworkUpgrade.upgradeId` on Ethereum L1 and those public testnets. */
const ethereumMainnetNetworkUpgradeSlugAliases = [
	{
		segmentSlug: 'paris',
		umbrellaUpgradeId: 'Merge',
	},
	{
		segmentSlug: 'bellatrix',
		umbrellaUpgradeId: 'Merge',
	},
	{
		segmentSlug: 'merge',
		umbrellaUpgradeId: 'Merge',
	},
	{
		segmentSlug: 'the-merge',
		umbrellaUpgradeId: 'Merge',
	},
	{
		segmentSlug: 'the merge',
		umbrellaUpgradeId: 'Merge',
	},
	{
		segmentSlug: 'shanghai',
		umbrellaUpgradeId: 'Shapella',
	},
	{
		segmentSlug: 'capella',
		umbrellaUpgradeId: 'Shapella',
	},
	{
		segmentSlug: 'cancun',
		umbrellaUpgradeId: 'Dencun',
	},
	{
		segmentSlug: 'deneb',
		umbrellaUpgradeId: 'Dencun',
	},
	{
		segmentSlug: 'prague',
		umbrellaUpgradeId: 'Pectra',
	},
	{
		segmentSlug: 'electra',
		umbrellaUpgradeId: 'Pectra',
	},
	{
		segmentSlug: 'osaka',
		umbrellaUpgradeId: 'Fusaka',
	},
	{
		segmentSlug: 'fulu',
		umbrellaUpgradeId: 'Fusaka',
	},
] as const satisfies readonly {
	segmentSlug: string
	umbrellaUpgradeId: string
}[]


// Lookups

export const ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug = Object.fromEntries(
	ethereumMainnetNetworkUpgradeSlugAliases.map((row) => [
		row.segmentSlug,
		row,
	])
)

export const networkUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkUpgrades.map((networkUpgrade) => [
		`${networkUpgrade.chainId}:${networkUpgrade.upgradeId}`,
		networkUpgrade,
	])
)

export const networkExecutionUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkExecutionUpgrades.map((executionUpgrade) => [
		`${executionUpgrade.chainId}:${executionUpgrade.upgradeId}`,
		executionUpgrade,
	])
)

export const networkConsensusUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkConsensusUpgrades.map((consensusUpgrade) => [
		`${consensusUpgrade.chainId}:${consensusUpgrade.upgradeId}`,
		consensusUpgrade,
	])
)
