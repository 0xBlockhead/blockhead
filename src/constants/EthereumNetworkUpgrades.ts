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
} from '$/constants/EthereumNetworkUpgradeActivations.ts'
import {
	ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId,
	networkConsensusUpgradeSlugByUpgradeId,
	networkExecutionUpgradeSlugByUpgradeId,
} from '$/constants/EthereumNetworkUpgradeSlugs.ts'
import { SpecificationRealm } from '$/constants/SpecificationProposal.ts'
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

const upgradeIdSlugSegment = (upgradeId: string): string => (
	String(upgradeId).trim().toLowerCase().replace(/\s+/g, '-')
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
	executionSpecsLink: string | undefined,
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
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Merge'].slug,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Paris' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Bellatrix' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Shapella' },
		name: 'Shapella',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Shapella'].slug,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Shanghai' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Capella' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Dencun' },
		name: 'Dencun',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Dencun'].slug,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Cancun' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Deneb' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Pectra' },
		name: 'Pectra',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Pectra'].slug,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Prague' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Electra' } },
	},
	{
		[EntityMetaKey.Id]: { upgradeId: 'Fusaka' },
		name: 'Fusaka',
		slug: ethereumNetworkMarketingNetworkUpgradeSlugByUpgradeId['Fusaka'].slug,
		$networkExecutionUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Osaka' } },
		$networkConsensusUpgrade: { [EntityMetaKey.Id]: { upgradeId: 'Fulu' } },
	},
] as const satisfies readonly NetworkUpgradeMarketingUmbrellaTemplate[]


const ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS = new Set<number>(ethereumNetworkUpgradeUmbrellaChainIds)

const activationFieldsFromActivation = (
	activation: NetworkUpgradeActivation['activation'],
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

const proposalStubs = (
	proposalIds: NonNullable<NetworkUpgradeActivation['proposalIds']>,
): Entity<typeof schema, EntityType.SpecificationProposal>[] => (
	proposalIds.map((proposalRef) => (
		{
			[EntityMetaKey.Id]: {
				realm: SpecificationRealm.Ethereum,
				category: proposalRef.kind,
				number: proposalRef.number,
			},
		}
	))
)

const networkExecutionUpgradeEntityFromSource = (
	chainId: number,
	activationSource: NetworkUpgradeActivation,
): Entity<typeof schema, EntityType.EthereumExecutionUpgrade> | null => {
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
				$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
				upgradeId,
			},
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
			...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
		} satisfies Entity<typeof schema, EntityType.EthereumExecutionUpgrade>
	}
	if (activationSource.executionProtocol == null) {
		return null
	}
	return {
		[EntityMetaKey.Id]: {
			$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
			upgradeId,
		},
		name: name ?? upgradeId,
		slug: slugValue,
		protocol: activationSource.executionProtocol,
		...activationFieldsFromActivation(activation),
		...(forkHash != null && { forkHash }),
		...(links?.ethereumOrg != null && { linkEthereumOrg: links.ethereumOrg }),
		...(links?.executionSpecs != null && { linkExecutionDocs: links.executionSpecs }),
		...(pinnedFilename != null && { executionSpecsPinnedMarkdownFilename: pinnedFilename }),
		...(links?.forkcast != null && { linkForkcast: links.forkcast }),
		...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
	} satisfies Entity<typeof schema, EntityType.EthereumExecutionUpgrade>
}

const networkConsensusUpgradeEntityFromSource = (
	chainId: number,
	activationSource: NetworkUpgradeActivation,
): Entity<typeof schema, EntityType.EthereumConsensusUpgrade> | null => {
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
			$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
			upgradeId,
		},
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
		...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
	} satisfies Entity<typeof schema, EntityType.EthereumConsensusUpgrade>
}

const networkUpgradeEntityFromSource = (
	chainId: number,
	activationSource: NetworkUpgradeActivation,
): Entity<typeof schema, EntityType.EthereumNetworkUpgrade> | null => {
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
			$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
			upgradeId,
		},
		name: name ?? upgradeId,
		slug: networkUpgradeSlugFromParts({
			upgradeId,
			slugOverride: slugMaybe,
		}),
		$networkExecutionUpgrade: {
			[EntityMetaKey.Id]: {
				$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
				upgradeId,
			},
		},
		...(hasConsensus && {
			$networkConsensusUpgrade: {
				[EntityMetaKey.Id]: {
					$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
					upgradeId,
				},
			},
		}),
	} satisfies Entity<typeof schema, EntityType.EthereumNetworkUpgrade>
}

const uniqueProposalsById = (
	proposals: readonly Entity<typeof schema, EntityType.SpecificationProposal>[],
): Entity<typeof schema, EntityType.SpecificationProposal>[] => {
	const seen = new Set<string>()
	const out: Entity<typeof schema, EntityType.SpecificationProposal>[] = []
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
		.filter((entity): entity is Entity<typeof schema, EntityType.EthereumExecutionUpgrade> => entity != null)
)

const networkConsensusUpgradesBuilt = (
	withChain
		.map(({ chainId, activationSource }) => networkConsensusUpgradeEntityFromSource(chainId, activationSource))
		.filter((entity): entity is Entity<typeof schema, EntityType.EthereumConsensusUpgrade> => entity != null)
)

const executionByKey: Record<string, Entity<typeof schema, EntityType.EthereumExecutionUpgrade>> = {}
const consensusByKey: Record<string, Entity<typeof schema, EntityType.EthereumConsensusUpgrade>> = {}
for (const executionUpgrade of networkExecutionUpgradesBuilt) {
	const id = executionUpgrade[EntityMetaKey.Id]
	executionByKey[`${id.$network.caip2.reference}:${id.upgradeId}`] = executionUpgrade
}
for (const consensusUpgrade of networkConsensusUpgradesBuilt) {
	const id = consensusUpgrade[EntityMetaKey.Id]
	consensusByKey[`${id.$network.caip2.reference}:${id.upgradeId}`] = consensusUpgrade
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
			subsumedOnChain.add(executionUpgradeId)
			subsumedOnChain.add(consensusUpgradeId)
		}
	umbrellaSubsumedUpgradeIdsByChain.set(chainId, subsumedOnChain)
}

const networkUpgradeMarketingUmbrellas = (
	[...ETHEREUM_NETWORK_UPGRADE_UMBRELLA_CHAIN_IDS].toSorted((a, b) => a - b)
		.filter((chainId) => chainIdsWithUpgradeActivations.includes(chainId))
		.flatMap((chainId) => (
			ethereumNetworkMarketingUmbrellas.flatMap((definition) => {
				const executionUpgradeId = definition.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId
				const consensusUpgradeId = definition.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId
				const umbrellaUpgradeId = definition[EntityMetaKey.Id].upgradeId
				return [{
					[EntityMetaKey.Id]: {
						$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
						upgradeId: umbrellaUpgradeId,
					},
					name: definition.name,
					slug: definition.slug,
					$networkExecutionUpgrade: {
						[EntityMetaKey.Id]: {
							$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
							upgradeId: executionUpgradeId,
						},
					},
					$networkConsensusUpgrade: {
						[EntityMetaKey.Id]: {
							$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
							upgradeId: consensusUpgradeId,
						},
					},
				} satisfies Entity<typeof schema, EntityType.EthereumNetworkUpgrade>]
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
			return networkUpgradeEntityFromSource(chainId, activationSource)
		})
		.filter((entity): entity is Entity<typeof schema, EntityType.EthereumNetworkUpgrade> => entity != null)
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
	{ segmentSlug: 'paris', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'bellatrix', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'merge', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'the-merge', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'the merge', umbrellaUpgradeId: 'Merge' },
	{ segmentSlug: 'shanghai', umbrellaUpgradeId: 'Shapella' },
	{ segmentSlug: 'capella', umbrellaUpgradeId: 'Shapella' },
	{ segmentSlug: 'cancun', umbrellaUpgradeId: 'Dencun' },
	{ segmentSlug: 'deneb', umbrellaUpgradeId: 'Dencun' },
	{ segmentSlug: 'prague', umbrellaUpgradeId: 'Pectra' },
	{ segmentSlug: 'electra', umbrellaUpgradeId: 'Pectra' },
	{ segmentSlug: 'osaka', umbrellaUpgradeId: 'Fusaka' },
	{ segmentSlug: 'fulu', umbrellaUpgradeId: 'Fusaka' },
] as const satisfies readonly {
	segmentSlug: string
	umbrellaUpgradeId: string
}[]


// Lookups

export const ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug = Object.fromEntries(
	ethereumMainnetNetworkUpgradeSlugAliases.map((row) => [
		row.segmentSlug,
		row,
	]),
)

export const networkUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkUpgrades.map((networkUpgrade) => [
		`${networkUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade[EntityMetaKey.Id].upgradeId}`,
		networkUpgrade,
	]),
)

export const networkExecutionUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkExecutionUpgrades.map((executionUpgrade) => [
		`${executionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${executionUpgrade[EntityMetaKey.Id].upgradeId}`,
		executionUpgrade,
	]),
)

export const networkConsensusUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	networkConsensusUpgrades.map((consensusUpgrade) => [
		`${consensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${consensusUpgrade[EntityMetaKey.Id].upgradeId}`,
		consensusUpgrade,
	]),
)
