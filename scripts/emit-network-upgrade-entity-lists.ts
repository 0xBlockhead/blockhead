/**
 * One-off / maintainer: expand chain activation sources into static `Entity` lists.
 * Run from repo root: `pnpm exec tsx scripts/emit-network-upgrade-entity-lists.ts`
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Entity } from '../src/schema/$schema.ts'
import { schema } from '../src/schema/index.ts'
import { EntityMetaKey } from '../src/schema/$EntityDefinition.ts'
import { EntityType } from '../src/schema/$EntityType.ts'
import {
	ExecutionProtocol,
	NetworkExecutionUpgradeLayer,
} from '../src/schema/NetworkUpgradeProtocols.ts'
import { ProposalRealm } from '../src/constants/Proposal.ts'
import {
	baseMainnetNetworkUpgradeActivations,
	baseSepoliaNetworkUpgradeActivations,
	ethereumMainnetNetworkUpgradeActivations,
	holeskyNetworkUpgradeActivations,
	opMainnetNetworkUpgradeActivations,
	opSepoliaNetworkUpgradeActivations,
	sepoliaNetworkUpgradeActivations,
	type NetworkUpgradeActivation,
} from '../src/constants/NetworkUpgradeActivations.ts'
import { stringify } from 'devalue'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../src/constants/NetworkUpgradeEntityLists.ts')

const jsonToSingleQuotes = (value: unknown) => (
	JSON.stringify(value, null, '\t').replace(/"/g, "'")
)

const PAIR_DEFINITIONS = [
	{
		upgradeId: 'Merge',
		name: 'The Merge',
		slug: 'merge',
		executionUpgradeId: 'Paris',
		consensusUpgradeId: 'Bellatrix',
	},
	{
		upgradeId: 'Shapella',
		name: 'Shapella',
		slug: 'shapella',
		executionUpgradeId: 'Shanghai',
		consensusUpgradeId: 'Capella',
	},
	{
		upgradeId: 'Dencun',
		name: 'Dencun',
		slug: 'dencun',
		executionUpgradeId: 'Cancun',
		consensusUpgradeId: 'Deneb',
	},
	{
		upgradeId: 'Pectra',
		name: 'Pectra',
		slug: 'pectra',
		executionUpgradeId: 'Prague',
		consensusUpgradeId: 'Electra',
	},
	{
		upgradeId: 'Fusaka',
		name: 'Fusaka',
		slug: 'fusaka',
		executionUpgradeId: 'Osaka',
		consensusUpgradeId: 'Fulu',
	},
] as const

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
	const slugValue = (
		slugMaybe ?? String(upgradeId).toLowerCase().replace(/\s+/g, '-')
	)
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
		slug: slugMaybe ?? String(upgradeId).toLowerCase().replace(/\s+/g, '-'),
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
	if (!hasExecution && !hasConsensus) {
		return null
	}
	const {
		upgradeId,
		name,
		slug: slugMaybe,
		activation,
		proposalIds,
	} = activationSource
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			upgradeId,
		},
		name: name ?? upgradeId,
		slug: slugMaybe ?? String(upgradeId).toLowerCase().replace(/\s+/g, '-'),
		...(activation?.block != null && { activationBlock: activation.block }),
		...(activation?.timestamp != null && { activationTimestamp: activation.timestamp }),
		...(activation?.epoch != null && { activationEpoch: activation.epoch }),
		...(hasExecution && {
				$executionUpgrade: {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						upgradeId,
					},
				},
			}),
		...(hasConsensus && {
				$consensusUpgrade: {
					[EntityMetaKey.Id]: {
						$network: { chainId },
						upgradeId,
					},
				},
			}),
		...(proposalIds != null && proposalIds.length > 0 && { $$proposals: proposalStubs(proposalIds) }),
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

/** Chains where execution + consensus pair umbrellas (Merge, Shapella, …) are modeled. */
const ETHEREUM_EXECUTION_CONSENSUS_PAIR_CHAIN_IDS = new Set([
	1,
	11_155_111,
	17_000,
])

const chainIdsInCatalog = (
	[...new Set(withChain.map(({ chainId }) => chainId))].toSorted((a, b) => a - b)
)

const networkExecutionUpgrades = (
	withChain
		.map(({ chainId, activationSource }) => networkExecutionUpgradeEntityFromSource(chainId, activationSource))
		.filter((entity): entity is Entity<typeof schema, EntityType.NetworkExecutionUpgrade> => entity != null)
)

const networkConsensusUpgrades = (
	withChain
		.map(({ chainId, activationSource }) => networkConsensusUpgradeEntityFromSource(chainId, activationSource))
		.filter((entity): entity is Entity<typeof schema, EntityType.NetworkConsensusUpgrade> => entity != null)
)

const executionByKey: Record<string, Entity<typeof schema, EntityType.NetworkExecutionUpgrade>> = {}
const consensusByKey: Record<string, Entity<typeof schema, EntityType.NetworkConsensusUpgrade>> = {}
for (const executionUpgrade of networkExecutionUpgrades) {
	const id = executionUpgrade[EntityMetaKey.Id]
	executionByKey[`${id.$network.chainId}:${id.upgradeId}`] = executionUpgrade
}
for (const consensusUpgrade of networkConsensusUpgrades) {
	const id = consensusUpgrade[EntityMetaKey.Id]
	consensusByKey[`${id.$network.chainId}:${id.upgradeId}`] = consensusUpgrade
}

const pairHalfIdsSubsumedOnChain = new Map<number, Set<string>>()

for (const chainId of chainIdsInCatalog) {
	if (!ETHEREUM_EXECUTION_CONSENSUS_PAIR_CHAIN_IDS.has(chainId)) {
		pairHalfIdsSubsumedOnChain.set(chainId, new Set())
		continue
	}
	const subsumedOnChain = new Set<string>()
	for (const definition of PAIR_DEFINITIONS) {
		const executionEntity = executionByKey[`${chainId}:${definition.executionUpgradeId}`]
		const consensusEntity = consensusByKey[`${chainId}:${definition.consensusUpgradeId}`]
		if (executionEntity != null && consensusEntity != null) {
			subsumedOnChain.add(definition.executionUpgradeId)
			subsumedOnChain.add(definition.consensusUpgradeId)
		}
	}
	pairHalfIdsSubsumedOnChain.set(chainId, subsumedOnChain)
}

const pairUmbrellas = (
	[...ETHEREUM_EXECUTION_CONSENSUS_PAIR_CHAIN_IDS].toSorted((a, b) => a - b)
		.filter((chainId) => chainIdsInCatalog.includes(chainId))
		.flatMap((chainId) => (
		PAIR_DEFINITIONS.map((definition) => {
			const executionEntity = executionByKey[`${chainId}:${definition.executionUpgradeId}`]
			const consensusEntity = consensusByKey[`${chainId}:${definition.consensusUpgradeId}`]
			if (executionEntity == null || consensusEntity == null) {
				return null
			}
			const activationBlock = executionEntity.activationBlock ?? consensusEntity.activationBlock
			const activationTimestamp = (
				executionEntity.activationTimestamp
				?? consensusEntity.activationTimestamp
			)
			const activationEpoch = (
				consensusEntity.activationEpoch
				?? executionEntity.activationEpoch
			)
			const umbrellaProposals = uniqueProposalsById([
				...(
					executionEntity.$$proposals != null ?
						[...executionEntity.$$proposals]
					:
						[]
				),
				...(
					consensusEntity.$$proposals != null ?
						[...consensusEntity.$$proposals]
					:
						[]
				),
			])
			return {
				[EntityMetaKey.Id]: {
					$network: { chainId },
					upgradeId: definition.upgradeId,
				},
				name: definition.name,
				slug: definition.slug,
				...(activationBlock != null && { activationBlock }),
				...(activationTimestamp != null && { activationTimestamp }),
				...(activationEpoch != null && { activationEpoch }),
				...(definition.executionUpgradeId != null && {
						$executionUpgrade: {
							[EntityMetaKey.Id]: {
								$network: { chainId },
								upgradeId: definition.executionUpgradeId,
							},
						},
					}),
				...(definition.consensusUpgradeId != null && {
						$consensusUpgrade: {
							[EntityMetaKey.Id]: {
								$network: { chainId },
								upgradeId: definition.consensusUpgradeId,
							},
						},
					}),
				...(umbrellaProposals.length > 0 && { $$proposals: umbrellaProposals }),
			} satisfies Entity<typeof schema, EntityType.NetworkUpgrade>
		}).filter((entity): entity is Entity<typeof schema, EntityType.NetworkUpgrade> => entity != null)
	))
)

const standaloneNetworkUpgrades = (
	withChain
		.map(({ chainId, activationSource }) => {
			if (
				ETHEREUM_EXECUTION_CONSENSUS_PAIR_CHAIN_IDS.has(chainId)
				&& pairHalfIdsSubsumedOnChain.get(chainId)?.has(activationSource.upgradeId) === true
			) {
				return null
			}
			return networkUpgradeEntityFromSource(chainId, activationSource)
		})
		.filter((entity): entity is Entity<typeof schema, EntityType.NetworkUpgrade> => entity != null)
)

const networkUpgrades = [
	...standaloneNetworkUpgrades,
	...pairUmbrellas,
]

const HEADER = [
	'/**',
	' * Materialized network upgrade entities (execution, consensus, umbrella NetworkUpgrade).',
	' * Generated: pnpm exec tsx scripts/emit-network-upgrade-entity-lists.ts',
	' * Edit NetworkUpgradeActivations.ts then re-run.',
	' */',
	'',
	'// Types/constants',
	'import type { Entity } from \'$/schema/$schema.ts\'',
	'import { schema } from \'$/schema/index.ts\'',
	'import { EntityType } from \'$/schema/$EntityType.ts\'',
	'',
	'',
	'// Constants',
	`export const networkExecutionUpgrades = ${jsonToSingleQuotes(networkExecutionUpgrades)} as readonly Entity<typeof schema, EntityType.NetworkExecutionUpgrade>[]`,
	'',
	`export const networkConsensusUpgrades = ${jsonToSingleQuotes(networkConsensusUpgrades)} as readonly Entity<typeof schema, EntityType.NetworkConsensusUpgrade>[]`,
	'',
	`export const networkUpgrades = ${jsonToSingleQuotes(networkUpgrades)} as readonly Entity<typeof schema, EntityType.NetworkUpgrade>[]`,
	'',
].join('\n')

writeFileSync(OUT, HEADER)

console.log('wrote', OUT)
