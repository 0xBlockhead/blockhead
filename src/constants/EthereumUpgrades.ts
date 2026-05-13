// Types/constants
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ForkScheduleKind } from '$/schema/NetworkFork.ts'
import { ethereumExecutionForks } from '$/constants/EthereumExecutionForks.ts'


// Constants
export const ethereumUpgrades = ethereumExecutionForks.map((forkRow) => (
	{
		[EntityMetaKey.Id]: {
			$network: forkRow[EntityMetaKey.Id].$network,
			upgradeId: forkRow[EntityMetaKey.Id].forkId,
		},
		name: forkRow.name,
		slug: forkRow.slug,
		...(forkRow.activationBlock != null ? { activationBlock: forkRow.activationBlock } : {}),
		...(forkRow.activationTimestamp != null ? { activationTimestamp: forkRow.activationTimestamp } : {}),
		...(forkRow.activationEpoch != null ? { activationEpoch: forkRow.activationEpoch } : {}),
		...(forkRow.executionProtocol != null || forkRow.linkExecutionDocs != null ?
			{
				$executionUpgrade: {
					[EntityMetaKey.Id]: {
						$network: forkRow[EntityMetaKey.Id].$network,
						upgradeId: forkRow[EntityMetaKey.Id].forkId,
					},
				},
			}
		:	{}),
		...(forkRow.consensusProtocol != null || forkRow.linkConsensusDocs != null ?
			{
				$consensusUpgrade: {
					[EntityMetaKey.Id]: {
						$network: forkRow[EntityMetaKey.Id].$network,
						upgradeId: forkRow[EntityMetaKey.Id].forkId,
					},
				},
			}
		:	{}),
		...(forkRow.$$proposals != null ? { $$proposals: forkRow.$$proposals } : {}),
	}
)) satisfies readonly Entity<typeof schema, EntityType.NetworkUpgrade>[]

export const ethereumExecutionUpgrades = ethereumExecutionForks
	.filter((forkRow) => (
		forkRow.executionProtocol != null
		|| forkRow.linkExecutionDocs != null
	))
	.map((forkRow) => (
		{
			[EntityMetaKey.Id]: {
				$network: forkRow[EntityMetaKey.Id].$network,
				upgradeId: forkRow[EntityMetaKey.Id].forkId,
			},
			name: forkRow.name,
			slug: forkRow.slug,
			...(forkRow.activationBlock != null ? { activationBlock: forkRow.activationBlock } : {}),
			...(forkRow.activationTimestamp != null ? { activationTimestamp: forkRow.activationTimestamp } : {}),
			...(forkRow.activationEpoch != null ? { activationEpoch: forkRow.activationEpoch } : {}),
			...(forkRow.executionProtocol != null ? { protocol: forkRow.executionProtocol } : {}),
			...(forkRow.forkHash != null ? { forkHash: forkRow.forkHash } : {}),
			...(forkRow.linkEthereumOrg != null ? { linkEthereumOrg: forkRow.linkEthereumOrg } : {}),
			...(forkRow.linkExecutionDocs != null ? { linkExecutionDocs: forkRow.linkExecutionDocs } : {}),
			...(forkRow.linkForkcast != null ? { linkForkcast: forkRow.linkForkcast } : {}),
			...(forkRow.$$proposals != null ? { $$proposals: forkRow.$$proposals } : {}),
		}
	)) satisfies readonly Entity<typeof schema, EntityType.NetworkExecutionUpgrade>[]

export const ethereumConsensusUpgrades = ethereumExecutionForks
	.filter((forkRow) => (
		forkRow.consensusProtocol != null
		|| forkRow.linkConsensusDocs != null
	))
	.map((forkRow) => (
		{
			[EntityMetaKey.Id]: {
				$network: forkRow[EntityMetaKey.Id].$network,
				upgradeId: forkRow[EntityMetaKey.Id].forkId,
			},
			name: forkRow.name,
			slug: forkRow.slug,
			...(forkRow.activationBlock != null ? { activationBlock: forkRow.activationBlock } : {}),
			...(forkRow.activationTimestamp != null ? { activationTimestamp: forkRow.activationTimestamp } : {}),
			...(forkRow.activationEpoch != null ? { activationEpoch: forkRow.activationEpoch } : {}),
			...(forkRow.consensusProtocol != null ? { protocol: forkRow.consensusProtocol } : {}),
			...(forkRow.linkEthereumOrg != null ? { linkEthereumOrg: forkRow.linkEthereumOrg } : {}),
			...(forkRow.linkConsensusDocs != null ? { linkConsensusDocs: forkRow.linkConsensusDocs } : {}),
			...(forkRow.linkForkcast != null ? { linkForkcast: forkRow.linkForkcast } : {}),
			...(forkRow.$$proposals != null ? { $$proposals: forkRow.$$proposals } : {}),
		}
	)) satisfies readonly Entity<typeof schema, EntityType.NetworkConsensusUpgrade>[]


// Functions
export const networkHasCatalogedBlobScheduleUpgrade = (chainId: number): boolean => (
	ethereumExecutionForks.some((row) => {
		const id = row[EntityMetaKey.Id]
		return (
			id.$network.chainId === chainId
			&& row.kind === ForkScheduleKind.Blob
		)
	})
)

export const networkUpgradeIdFromChainIdAndUrlSegment = (
	chainId: number,
	segment: string,
): string | undefined => (
	ethereumUpgrades.find((row) => {
		const id = row[EntityMetaKey.Id]
		if (id.$network.chainId !== chainId) return false
		const slugRaw = row.slug
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
		)
	})?.[EntityMetaKey.Id].upgradeId
)


// Lookups
export const ethereumUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	ethereumUpgrades.map((row) => [
		`${row[EntityMetaKey.Id].$network.chainId}:${row[EntityMetaKey.Id].upgradeId}`,
		row,
	]),
)

export const ethereumExecutionUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	ethereumExecutionUpgrades.map((row) => [
		`${row[EntityMetaKey.Id].$network.chainId}:${row[EntityMetaKey.Id].upgradeId}`,
		row,
	]),
)

export const ethereumConsensusUpgradeByChainIdAndUpgradeId = Object.fromEntries(
	ethereumConsensusUpgrades.map((row) => [
		`${row[EntityMetaKey.Id].$network.chainId}:${row[EntityMetaKey.Id].upgradeId}`,
		row,
	]),
)
