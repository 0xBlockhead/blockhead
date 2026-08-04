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
import { ChainId } from '$/constants/ChainId.ts'
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
	readonly activationBlock?: number
	readonly activationTimestampMs?: number
	readonly activationEpoch?: number
}


// Constants

const upgradeIdSlugSegment = (upgradeId: string): string => (
	String(upgradeId).toLowerCase().replace(/\s+/g, '-')
)

const upgradeNameFromUpgradeId = (upgradeId: string): string => (
	upgradeId
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
)

const upgradeIdentityFromActivation = (args: {
	readonly upgradeId: string
	readonly name: string | undefined
	readonly slugOverride: string | undefined
}) => ({
	upgradeId: args.upgradeId,
	name: args.name ?? upgradeNameFromUpgradeId(args.upgradeId),
	slug: (
		args.slugOverride
		?? upgradeIdSlugSegment(args.upgradeId)
	),
})

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
		slug: upgradeIdSlugSegment('Merge'),
		executionUpgradeId: 'Paris',
		consensusUpgradeId: 'Bellatrix',
	},
	{
		upgradeId: 'Shapella',
		name: 'Shapella',
		slug: upgradeIdSlugSegment('Shapella'),
		executionUpgradeId: 'Shanghai',
		consensusUpgradeId: 'Capella',
	},
	{
		upgradeId: 'Dencun',
		name: 'Dencun',
		slug: upgradeIdSlugSegment('Dencun'),
		executionUpgradeId: 'Cancun',
		consensusUpgradeId: 'Deneb',
	},
	{
		upgradeId: 'Pectra',
		name: 'Pectra',
		slug: upgradeIdSlugSegment('Pectra'),
		executionUpgradeId: 'Prague',
		consensusUpgradeId: 'Electra',
	},
	{
		upgradeId: 'Fusaka',
		name: 'Fusaka',
		slug: upgradeIdSlugSegment('Fusaka'),
		executionUpgradeId: 'Osaka',
		consensusUpgradeId: 'Fulu',
	},
] as const satisfies readonly NetworkUpgradeMarketingUmbrellaTemplate[]


const ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS = new Set<number>([
	ChainId.Ethereum,
	ChainId.EthereumSepolia,
	ChainId.Holesky,
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
	const identity = upgradeIdentityFromActivation({
		upgradeId,
		name,
		slugOverride: slugMaybe,
	})
	const pinnedFilename = executionSpecsPinnedMarkdownFilenameFromLink(links?.executionSpecs)
	if (activationSource.blobParameterOnly === true)
		return {
			chainId,
			...identity,
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
		...identity,
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
	const identity = upgradeIdentityFromActivation({
		upgradeId,
		name,
		slugOverride: slugMaybe,
	})
	return {
		chainId,
		...identity,
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
	const identity = upgradeIdentityFromActivation({
		upgradeId,
		name,
		slugOverride: slugMaybe,
	})
	return {
		chainId,
		...identity,
		...activationFieldsFromActivation(activationSource.activation),
		executionUpgradeId: identity.upgradeId,
		...(hasConsensus && { consensusUpgradeId: identity.upgradeId }),
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
	...activationsWithChainId(ChainId.Ethereum, ethereumMainnetNetworkUpgradeActivations),
	...activationsWithChainId(ChainId.Optimism, opMainnetNetworkUpgradeActivations),
	...activationsWithChainId(ChainId.Base, baseMainnetNetworkUpgradeActivations),
	...activationsWithChainId(ChainId.Holesky, holeskyNetworkUpgradeActivations),
	...activationsWithChainId(ChainId.BaseSepolia, baseSepoliaNetworkUpgradeActivations),
	...activationsWithChainId(ChainId.EthereumSepolia, sepoliaNetworkUpgradeActivations),
	...activationsWithChainId(ChainId.OPSepolia, opSepoliaNetworkUpgradeActivations),
]

const chainIdsWithUpgradeActivations = (
	[...new Set(withChain.map(({ chainId }) => chainId))].toSorted((a, b) => a - b)
)

export const networkExecutionUpgrades = (
	withChain
		.map(({ chainId, activationSource }) => networkExecutionUpgradeRowFromActivation(chainId, activationSource))
		.filter((entity): entity is NetworkExecutionUpgradeRow => entity != null)
)

export const networkConsensusUpgrades = (
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
			ethereumNetworkMarketingUmbrellas.map((definition) => {
				const executionUpgrade = networkExecutionUpgrades.find((upgrade) => (
					upgrade.chainId === chainId
					&& upgrade.upgradeId === definition.executionUpgradeId
				))

				return {
					chainId,
					upgradeId: definition.upgradeId,
					name: definition.name,
					slug: definition.slug,
					executionUpgradeId: definition.executionUpgradeId,
					consensusUpgradeId: definition.consensusUpgradeId,
					...(executionUpgrade?.activationBlock != null && { activationBlock: executionUpgrade.activationBlock }),
					...(executionUpgrade?.activationTimestampMs != null && { activationTimestampMs: executionUpgrade.activationTimestampMs }),
					...(executionUpgrade?.activationEpoch != null && { activationEpoch: executionUpgrade.activationEpoch }),
				}
			})
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

export const networkUpgrades = [
	...standaloneNetworkUpgrades,
	...networkUpgradeMarketingUmbrellas,
]

const ethereumMainnetNetworkUpgradeExceptionalSlugAliases = [
	{
		segmentSlug: 'the-merge',
		umbrellaUpgradeId: 'Merge',
	},
	{
		segmentSlug: 'the merge',
		umbrellaUpgradeId: 'Merge',
	},
] as const satisfies readonly {
	segmentSlug: string
	umbrellaUpgradeId: string
}[]

/** Execution / consensus codenames route to their canonical marketing umbrella. */
const ethereumMainnetNetworkUpgradeSlugAliases = (
	ethereumNetworkMarketingUmbrellas.flatMap((umbrella) => [
		...[
			umbrella.executionUpgradeId,
			umbrella.consensusUpgradeId,
		].flatMap((upgradeId) => (
			ethereumMainnetNetworkUpgradeActivations.flatMap((activation: NetworkUpgradeActivation) => (
				activation.upgradeId === upgradeId ?
					[
						{
							segmentSlug: activation.slug ?? upgradeIdSlugSegment(activation.upgradeId),
							umbrellaUpgradeId: umbrella.upgradeId,
						},
					]
				:
					[]
			))
		)),
		...ethereumMainnetNetworkUpgradeExceptionalSlugAliases.filter((alias) => (
			alias.umbrellaUpgradeId === umbrella.upgradeId
		)),
	])
)


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

export const networkUpgradesByChainId = Object.groupBy(
	networkUpgrades,
	(networkUpgrade) => networkUpgrade.chainId
)

export const networkUpgradeByChainIdAndConsensusUpgradeId = Object.fromEntries(
	networkUpgrades.flatMap((networkUpgrade) => (
		networkUpgrade.consensusUpgradeId == null ?
			[]
		:
			[[
				`${networkUpgrade.chainId}:${networkUpgrade.consensusUpgradeId}`,
				networkUpgrade,
			]]
	))
)

export const networkUpgradeByChainIdAndRouteSegment = Object.fromEntries(
	networkUpgrades.flatMap((networkUpgrade) => [
		...[
			networkUpgrade.upgradeId,
			networkUpgrade.slug,
			networkUpgrade.upgradeId.toLowerCase(),
			networkUpgrade.slug.toLowerCase(),
			upgradeIdSlugSegment(networkUpgrade.upgradeId),
			upgradeIdSlugSegment(networkUpgrade.slug),
		].map((segment) => [
			`${networkUpgrade.chainId}:${segment}`,
			networkUpgrade,
		]),
		...ethereumMainnetNetworkUpgradeSlugAliases.flatMap((alias) => (
			alias.umbrellaUpgradeId === networkUpgrade.upgradeId ?
				[
					[
						`${networkUpgrade.chainId}:${alias.segmentSlug}`,
						networkUpgrade,
					],
				]
			:
				[]
		)),
	])
)

export const networkExecutionUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkExecutionUpgrades.map((executionUpgrade) => [
		`${executionUpgrade.chainId}:${executionUpgrade.upgradeId}`,
		executionUpgrade,
	])
)

export const networkExecutionUpgradesByChainId = Object.groupBy(
	networkExecutionUpgrades,
	(executionUpgrade) => executionUpgrade.chainId
)

export const networkExecutionUpgradeByChainIdAndRouteSegment = Object.fromEntries(
	networkExecutionUpgrades.flatMap((executionUpgrade) => (
		[
			executionUpgrade.upgradeId,
			executionUpgrade.slug,
			executionUpgrade.upgradeId.toLowerCase(),
			executionUpgrade.slug.toLowerCase(),
			upgradeIdSlugSegment(executionUpgrade.upgradeId),
			upgradeIdSlugSegment(executionUpgrade.slug),
		].map((segment) => [
			`${executionUpgrade.chainId}:${segment}`,
			executionUpgrade,
		])
	))
)

export const networkConsensusUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkConsensusUpgrades.map((consensusUpgrade) => [
		`${consensusUpgrade.chainId}:${consensusUpgrade.upgradeId}`,
		consensusUpgrade,
	])
)

export const networkConsensusUpgradesByChainId = Object.groupBy(
	networkConsensusUpgrades,
	(consensusUpgrade) => consensusUpgrade.chainId
)

export const networkConsensusUpgradeByChainIdAndRouteSegment = Object.fromEntries(
	networkConsensusUpgrades.flatMap((consensusUpgrade) => (
		[
			consensusUpgrade.upgradeId,
			consensusUpgrade.slug,
			consensusUpgrade.upgradeId.toLowerCase(),
			consensusUpgrade.slug.toLowerCase(),
			upgradeIdSlugSegment(consensusUpgrade.upgradeId),
			upgradeIdSlugSegment(consensusUpgrade.slug),
		].map((segment) => [
			`${consensusUpgrade.chainId}:${segment}`,
			consensusUpgrade,
		])
	))
)
