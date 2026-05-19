/**
 * `NetworkUpgrade` ties a catalog / marketing id to a `NetworkExecutionUpgrade` and optionally a
 * `NetworkConsensusUpgrade` when both layers shipped under one name (e.g. umbrella labels on L1).
 * Consensus-only forks (beacon-only activations) are listed only on `Network.$$consensusUpgrades`, not here.
 * @see https://ethereum.org/en/history/
 */

// Types
import type { Entity } from '$/schema/$schema.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
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
} from '$/constants/NetworkUpgradeActivations.ts'
import {
	ethereumNetworkMarketingNetworkUpgradeSlugs,
	networkConsensusUpgradeSlugFromParts,
	networkExecutionUpgradeSlugFromParts,
	networkUpgradeSlugFromParts,
	networkUpgradeSlugSegmentFromUpgradeId,
} from '$/constants/NetworkUpgradeSlugs.ts'
import { ProposalRealm } from '$/constants/Proposal.ts'
import { stringify } from 'devalue'

/**
 * Manual dual-layer marketing umbrellas (Merge, Shapella, …). Shaped like `NetworkUpgrade` refs;
 * `$network` on ids is applied when expanding to per-chain rows.
 */
export type NetworkUpgradeMarketingUmbrellaTemplate = {
	readonly [EntityMetaKey.Id]: { readonly upgradeId: string }
	readonly name: string
	readonly slug: string
	readonly $networkExecutionUpgrade: { readonly [EntityMetaKey.Id]: { readonly upgradeId: string } }
	readonly $networkConsensusUpgrade: { readonly [EntityMetaKey.Id]: { readonly upgradeId: string } }
}


// Constants
/** Canonical `*.md` under pinned `ethereum/execution-specs/.../network-upgrades/mainnet-upgrades/`. */
const executionSpecsPinnedMarkdownFilenameFromLink = (
	executionSpecsLink: string | undefined,
): string | undefined => {
	if (executionSpecsLink == null) return undefined
	const pathOnly = executionSpecsLink.split('?')[0] ?? executionSpecsLink
	if (!pathOnly.includes('ethereum/execution-specs')) return undefined
	if (!pathOnly.includes('network-upgrades/mainnet-upgrades')) return undefined
	const segments = pathOnly.split('/')
	const lastSegment = segments[segments.length - 1]
	if (lastSegment == null || !lastSegment.endsWith('.md')) return undefined
	return /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.md$/.test(lastSegment) ? lastSegment : undefined
}

/** L1 / public testnets where merge-era umbrella ids (Merge, Shapella, …) subsume separate execution and consensus fork names into one NetworkUpgrade row. */
export const ethereumNetworkUpgradeUmbrellaChainIds = [
	1,
	11_155_111,
	17_000,
] as const satisfies readonly number[]

export const ethereumNetworkMarketingUmbrellas = [
	{
		[EntityMetaKey.Id]: { upgradeId: 'Merge' },
		name: 'The Merge',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugs.Merge,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Paris' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Bellatrix' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Shapella' },
		name: 'Shapella',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugs.Shapella,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Shanghai' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Capella' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Dencun' },
		name: 'Dencun',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugs.Dencun,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Cancun' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Deneb' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Pectra' },
		name: 'Pectra',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugs.Pectra,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Prague' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Electra' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Fusaka' },
		name: 'Fusaka',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugs.Fusaka,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Osaka' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Fulu' } },
	},
] as const satisfies readonly NetworkUpgradeMarketingUmbrellaTemplate[]


const ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS = new Set(ethereumNetworkUpgradeUmbrellaChainIds)

const proposalStubs = (
	proposalIds: NonNullable<NetworkUpgradeActivation['proposalIds']>,
): Entity<typeof schema, EntityType.Proposal>[] => (
	proposalIds.map((proposalRef) => (
		{
			[EntityMetaKey.Id]: {
				realm: ProposalRealm.Ethereum,
				category: proposalRef.kind,
				number: proposalRef.number,
			},
			documentTitle: null,
			documentCategory: null,
			documentStatus: null,
			documentBody: null,
		}
	))
)

const networkExecutionUpgradeEntityFromSource = (
	chainId: number,
	activationSource: NetworkUpgradeActivation,
): Entity<typeof schema, EntityType.NetworkExecutionUpgrade> | null => {
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
	if (activationSource.blobParameterOnly === true) {
		return {
			[EntityMetaKey.Id]: {
				$network: { chainId },
				upgradeId,
			},
			name: name ?? upgradeId,
			slug: slugValue,
			layer: NetworkExecutionUpgradeLayer.Blob,
			protocol: ExecutionProtocol.OpStack,
			...(activation?.block != null && { activationBlock: activation.block }),
			...(activation?.timestamp != null && { activationTimestamp: activation.timestamp }),
			...(activation?.epoch != null && { activationEpoch: activation.epoch }),
			...(forkHash != null && { forkHash }),
			...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
			...(links?.executionSpecs != null && { linkExecutionDocs: links.executionSpecs }),
			...(pinnedFilename != null && { executionSpecsPinnedMarkdownFilename: pinnedFilename }),
			...(links?.forkcast != null && { linkForkcast: links.forkcast }),
			...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
		} satisfies Entity<typeof schema, EntityType.NetworkExecutionUpgrade>
	}
	if (activationSource.executionProtocol == null) {
		return null
	}
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			upgradeId,
		},
		name: name ?? upgradeId,
		slug: slugValue,
		...(activationSource.executionProtocol != null && { protocol: activationSource.executionProtocol }),
		...(activation?.block != null && { activationBlock: activation.block }),
		...(activation?.timestamp != null && { activationTimestamp: activation.timestamp }),
		...(activation?.epoch != null && { activationEpoch: activation.epoch }),
		...(forkHash != null && { forkHash }),
		...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
		...(links?.executionSpecs != null && { linkExecutionDocs: links.executionSpecs }),
		...(pinnedFilename != null && { executionSpecsPinnedMarkdownFilename: pinnedFilename }),
		...(links?.forkcast != null && { linkForkcast: links.forkcast }),
		...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
	} satisfies Entity<typeof schema, EntityType.NetworkExecutionUpgrade>
}

const networkConsensusUpgradeEntityFromSource = (
	chainId: number,
	activationSource: NetworkUpgradeActivation,
): Entity<typeof schema, EntityType.NetworkConsensusUpgrade> | null => {
	if (activationSource.consensusProtocol == null) {
		return null
	}
	const {
		upgradeId,
		name,
		slug: slugMaybe,
		activation,
		links,
		proposalIds,
	} = activationSource
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			upgradeId,
		},
		name: name ?? upgradeId,
		slug: networkConsensusUpgradeSlugFromParts({
			upgradeId,
			slugOverride: slugMaybe,
		}),
		protocol: activationSource.consensusProtocol,
		...(activation?.block != null && { activationBlock: activation.block }),
		...(activation?.timestamp != null && { activationTimestamp: activation.timestamp }),
		...(activation?.epoch != null && { activationEpoch: activation.epoch }),
		...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
		...(links?.consensusSpecs != null && { linkConsensusDocs: links.consensusSpecs }),
		...(links?.forkcast != null && { linkForkcast: links.forkcast }),
		...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
	} satisfies Entity<typeof schema, EntityType.NetworkConsensusUpgrade>
}

const networkUpgradeEntityFromSource = (
	chainId: number,
	activationSource: NetworkUpgradeActivation,
): Entity<typeof schema, EntityType.NetworkUpgrade> | null => {
	const hasExecution = (
		activationSource.blobParameterOnly === true
		|| activationSource.executionProtocol != null
	)
	const hasConsensus = activationSource.consensusProtocol != null
	if (!hasExecution) {
		return null
	}
	const {
		upgradeId,
		name,
		slug: slugMaybe,
	} = activationSource
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			upgradeId,
		},
		name: name ?? upgradeId,
		slug: networkUpgradeSlugFromParts({
			upgradeId,
			slugOverride: slugMaybe,
		}),
		$networkExecutionUpgrade: {
			[EntityMetaKey.Id]: {
				$network: { chainId },
				upgradeId,
			},
		},
		...(hasConsensus && {
			$networkConsensusUpgrade: {
				[EntityMetaKey.Id]: {
					$network: { chainId },
					upgradeId,
				},
			},
		}),
	} satisfies Entity<typeof schema, EntityType.NetworkUpgrade>
}

const uniqueProposalsById = (
	proposals: readonly Entity<typeof schema, EntityType.Proposal>[],
): Entity<typeof schema, EntityType.Proposal>[] => {
	const seen = new Set<string>()
	const out: Entity<typeof schema, EntityType.Proposal>[] = []
	for (const proposal of proposals) {
		const key = stringify(proposal[EntityMetaKey.Id])
		if (seen.has(key)) continue
		seen.add(key)
		out.push(proposal)
	}
	return out
}

const activationsWithChainId = (
	chainId: number,
	activations: readonly NetworkUpgradeActivation[],
): { chainId: number, activationSource: NetworkUpgradeActivation }[] => (
	activations.map((activationSource) => ({ chainId, activationSource }))
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
		.map(({ chainId, activationSource }) => networkExecutionUpgradeEntityFromSource(chainId, activationSource))
		.filter((entity): entity is Entity<typeof schema, EntityType.NetworkExecutionUpgrade> => entity != null)
)

const networkConsensusUpgradesBuilt = (
	withChain
		.map(({ chainId, activationSource }) => networkConsensusUpgradeEntityFromSource(chainId, activationSource))
		.filter((entity): entity is Entity<typeof schema, EntityType.NetworkConsensusUpgrade> => entity != null)
)

const executionByKey: Record<string, Entity<typeof schema, EntityType.NetworkExecutionUpgrade>> = {}
const consensusByKey: Record<string, Entity<typeof schema, EntityType.NetworkConsensusUpgrade>> = {}
for (const executionUpgrade of networkExecutionUpgradesBuilt) {
	const id = executionUpgrade[EntityMetaKey.Id]
	executionByKey[`${id.$network.chainId}:${id.upgradeId}`] = executionUpgrade
}
for (const consensusUpgrade of networkConsensusUpgradesBuilt) {
	const id = consensusUpgrade[EntityMetaKey.Id]
	consensusByKey[`${id.$network.chainId}:${id.upgradeId}`] = consensusUpgrade
}

const umbrellaSubsumedUpgradeIdsByChain = new Map<number, Set<string>>()

for (const chainId of chainIdsWithUpgradeActivations) {
	if (!ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS.has(chainId)) {
		umbrellaSubsumedUpgradeIdsByChain.set(chainId, new Set())
		continue
	}
	const subsumedOnChain = new Set<string>()
	for (const definition of ethereumNetworkMarketingUmbrellas) {
		const executionUpgradeId = definition.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId
		const consensusUpgradeId = definition.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId
		const executionEntity = executionByKey[`${chainId}:${executionUpgradeId}`]
		const consensusEntity = consensusByKey[`${chainId}:${consensusUpgradeId}`]
		if (executionEntity != null && consensusEntity != null) {
			subsumedOnChain.add(executionUpgradeId)
			subsumedOnChain.add(consensusUpgradeId)
		}
	}
	umbrellaSubsumedUpgradeIdsByChain.set(chainId, subsumedOnChain)
}

const networkUpgradeMarketingUmbrellaRows = (
	[...ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS].toSorted((a, b) => a - b)
		.filter((chainId) => chainIdsWithUpgradeActivations.includes(chainId))
		.flatMap((chainId) => (
			ethereumNetworkMarketingUmbrellas.map((definition) => {
				const executionUpgradeId = definition.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId
				const consensusUpgradeId = definition.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId
				const executionEntity = executionByKey[`${chainId}:${executionUpgradeId}`]
				const consensusEntity = consensusByKey[`${chainId}:${consensusUpgradeId}`]
				if (executionEntity == null || consensusEntity == null) {
					return null
				}
				const umbrellaUpgradeId = definition[EntityMetaKey.Id].upgradeId
				return {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						upgradeId: umbrellaUpgradeId,
					},
					name: definition.name,
					slug: definition.slug,
					$networkExecutionUpgrade: {
						[EntityMetaKey.Id]: {
							$network: { chainId },
							upgradeId: executionUpgradeId,
						},
					},
					$networkConsensusUpgrade: {
						[EntityMetaKey.Id]: {
							$network: { chainId },
							upgradeId: consensusUpgradeId,
						},
					},
				} satisfies Entity<typeof schema, EntityType.NetworkUpgrade>
			}).filter((entity): entity is Entity<typeof schema, EntityType.NetworkUpgrade> => entity != null)
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
			return networkUpgradeEntityFromSource(chainId, activationSource)
		})
		.filter((entity): entity is Entity<typeof schema, EntityType.NetworkUpgrade> => entity != null)
)

const networkUpgradesBuilt = [
	...standaloneNetworkUpgrades,
	...networkUpgradeMarketingUmbrellaRows,
]

export const networkExecutionUpgrades: readonly Entity<
	typeof schema,
	EntityType.NetworkExecutionUpgrade
>[] = networkExecutionUpgradesBuilt

export const networkConsensusUpgrades: readonly Entity<
	typeof schema,
	EntityType.NetworkConsensusUpgrade
>[] = networkConsensusUpgradesBuilt

export const networkUpgrades: readonly Entity<
	typeof schema,
	EntityType.NetworkUpgrade
>[] = networkUpgradesBuilt


/** Execution / consensus codename aliases → umbrella `NetworkUpgrade.upgradeId` on Ethereum L1 and those public testnets (mainnet 1, Sepolia, Holesky). */
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


// Lookups
export const networkHasBlobParameterExecutionUpgrade = (chainId: number): boolean => (
	networkExecutionUpgrades.some((executionUpgrade) => (
		executionUpgrade[EntityMetaKey.Id].$network.chainId === chainId
		&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
	))
)

export const networkUpgradeIdFromChainIdAndUrlSegment = (
	chainId: number,
	segment: string,
): string | undefined => {
	const direct = networkUpgrades.find((networkUpgrade) => {
		const id = networkUpgrade[EntityMetaKey.Id]
		if (id.$network.chainId !== chainId) return false
		const slugRaw = networkUpgrade.slug
		const slug = (
			typeof slugRaw === 'string' && slugRaw.length > 0 ?
				slugRaw
			:
				networkUpgradeSlugSegmentFromUpgradeId(id.upgradeId)
		)
		const { upgradeId } = id
		return (
			segment === upgradeId
			|| segment === slug
			|| segment.toLowerCase() === upgradeId.toLowerCase()
			|| segment.toLowerCase() === slug.toLowerCase()
			|| networkUpgradeSlugSegmentFromUpgradeId(segment) === networkUpgradeSlugSegmentFromUpgradeId(slug)
			|| networkUpgradeSlugSegmentFromUpgradeId(segment) === networkUpgradeSlugSegmentFromUpgradeId(upgradeId)
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
		const aliasTarget = ETHEREUM_MAINNET_NETWORK_UPGRADE_SLUG_ALIASES[networkUpgradeSlugSegmentFromUpgradeId(segment)]
		if (aliasTarget != null) {
			return (
				networkUpgrades.find((networkUpgrade) => (
					networkUpgrade[EntityMetaKey.Id].$network.chainId === chainId
					&& networkUpgrade[EntityMetaKey.Id].upgradeId === aliasTarget
				))
				?.[EntityMetaKey.Id].upgradeId
			)
		}
	}

	return undefined
}

export const networkUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkUpgrades.map((networkUpgrade) => [
		`${networkUpgrade[EntityMetaKey.Id].$network.chainId}:${networkUpgrade[EntityMetaKey.Id].upgradeId}`,
		networkUpgrade,
	]),
)

export const networkExecutionUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkExecutionUpgrades.map((executionUpgrade) => [
		`${executionUpgrade[EntityMetaKey.Id].$network.chainId}:${executionUpgrade[EntityMetaKey.Id].upgradeId}`,
		executionUpgrade,
	]),
)

export const networkConsensusUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkConsensusUpgrades.map((consensusUpgrade) => [
		`${consensusUpgrade[EntityMetaKey.Id].$network.chainId}:${consensusUpgrade[EntityMetaKey.Id].upgradeId}`,
		consensusUpgrade,
	]),
)

/** Fills `NetworkUpgrade` activation + `$$proposals` from linked fork rows (single source of truth). */
export const resolveNetworkUpgradeDenormalizedFields = (
	row: Entity<typeof schema, EntityType.NetworkUpgrade>,
): Partial<
	Pick<
		Entity<typeof schema, EntityType.NetworkUpgrade>,
		| 'activationBlock'
		| 'activationTimestamp'
		| 'activationEpoch'
		| '$$proposals'
	>
> => {
	const execRef = row.$networkExecutionUpgrade[EntityMetaKey.Id]
	const executionRow = networkExecutionUpgradeByChainIdAndUpgradeId[
		`${execRef.$network.chainId}:${execRef.upgradeId}`
	]
	const consRef = row.$networkConsensusUpgrade
	const consensusRow = (
		consRef == null
			? null
			: networkConsensusUpgradeByChainIdAndUpgradeId[
				`${consRef[EntityMetaKey.Id].$network.chainId}:${consRef[EntityMetaKey.Id].upgradeId}`
			]
	)

	const activationBlock = executionRow?.activationBlock ?? consensusRow?.activationBlock
	const activationTimestamp = executionRow?.activationTimestamp ?? consensusRow?.activationTimestamp
	const activationEpoch = consensusRow?.activationEpoch ?? executionRow?.activationEpoch

	const mergedProposals = uniqueProposalsById([
		...(executionRow?.$$proposals != null ? [...executionRow.$$proposals] : []),
		...(consensusRow?.$$proposals != null ? [...consensusRow.$$proposals] : []),
	])

	return {
		...(activationBlock != null && { activationBlock }),
		...(activationTimestamp != null && { activationTimestamp }),
		...(activationEpoch != null && { activationEpoch }),
		...(mergedProposals.length > 0 && { $$proposals: mergedProposals }),
	}
}
