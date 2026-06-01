import { beaconRestBaseByExecutionChainId } from '$/constants/BeaconConsensus.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { jsonRpcUrlWithTransportForChain } from '$/sources/Evm/JsonRpc/client.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { stringify } from 'devalue'


const executionBlockActivationTimestampMsByKey = new Map<string, number | undefined>()

const activationTimestampMsFromSecondsOrMs = (
	timestamp: number,
): number => (
	timestamp < 1e12 ?
		timestamp * 1000
	:
		timestamp
)

const consensusEpochActivationTimestampMs = async (
	chainId: number,
	activationEpoch: number,
): Promise<number | undefined> => {
	const beaconRestBaseUrl = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
	if (beaconRestBaseUrl == null)
		return undefined

	const { getGenesisTimeSeconds } = await import('$/sources/Beacon/Rest/queries.ts')
	const genesisTimeSeconds = await singleFlight(getGenesisTimeSeconds)(beaconRestBaseUrl)
		.catch(() => undefined)
	if (genesisTimeSeconds == null)
		return undefined

	return (
		genesisTimeSeconds + activationEpoch * 32 * 12
	) * 1000
}

const executionBlockActivationTimestampMs = async (
	chainId: number,
	activationBlock: number,
): Promise<number | undefined> => {
	const cacheKey = `${chainId}:${activationBlock}`
	if (executionBlockActivationTimestampMsByKey.has(cacheKey))
		return executionBlockActivationTimestampMsByKey.get(cacheKey)

	const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
	if (jsonRpcTransport == null) {
		executionBlockActivationTimestampMsByKey.set(cacheKey, undefined)
		return undefined
	}
	const { getBlockByNumber } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
	const { getHttpProvider } = await import('$/lib/voltaire.ts')
	const block = await getBlockByNumber({
		provider: getHttpProvider(jsonRpcTransport.rpcUrl),
		blockNumber: BigInt(activationBlock),
	}).catch(() => undefined)
	const activationTimestampMs = (
		block?.timestamp == null ?
			undefined
		:
			activationTimestampMsFromSecondsOrMs(Number(block.timestamp))
	)
	executionBlockActivationTimestampMsByKey.set(cacheKey, activationTimestampMs)
	return activationTimestampMs
}

export const networkUpgradeDenormalizedFields = (
	row: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>,
	networkExecutionUpgradeByChainIdAndUpgradeId: Record<
		string,
		Entity<typeof schema, EntityType.EthereumExecutionUpgrade>
	>,
	networkConsensusUpgradeByChainIdAndUpgradeId: Record<
		string,
		Entity<typeof schema, EntityType.EthereumConsensusUpgrade>
	>,
): Partial<
	Pick<
		Entity<typeof schema, EntityType.EthereumNetworkUpgrade>,
		| 'activationBlock'
		| 'activationTimestampMs'
		| 'activationEpoch'
		| '$$proposals'
	>
> => {
	const execRef = row.$networkExecutionUpgrade?.[EntityMetaKey.Id]
	const executionRow = (
		execRef == null ?
			null
		:
			networkExecutionUpgradeByChainIdAndUpgradeId[
				`${execRef.$network.caip2.reference}:${execRef.upgradeId}`
			]
	)
	const consRef = row.$networkConsensusUpgrade
	const consensusRow = (
		consRef == null ?
			null
		:
			networkConsensusUpgradeByChainIdAndUpgradeId[
				`${consRef[EntityMetaKey.Id].$network.caip2.reference}:${consRef[EntityMetaKey.Id].upgradeId}`
			]
	)

	const activationBlock = executionRow?.activationBlock ?? consensusRow?.activationBlock
	const activationTimestampsMs = [
		executionRow?.activationTimestampMs,
		consensusRow?.activationTimestampMs,
	].filter((timestamp): timestamp is number => timestamp != null)
	const activationTimestampMs = (
		activationTimestampsMs.length > 0 ?
			Math.max(...activationTimestampsMs)
		:
			undefined
	)
	const activationEpoch = consensusRow?.activationEpoch ?? executionRow?.activationEpoch

	const seen = new Set<string>()
	const linkedProposals: Entity<typeof schema, EntityType.SpecificationProposal>[] = []
	for (const proposal of [
		...(executionRow?.$$proposals ?? []),
		...(consensusRow?.$$proposals ?? []),
	]) {
		const key = stringify(proposal[EntityMetaKey.Id])
		if (seen.has(key))
			continue

		seen.add(key)
		linkedProposals.push(proposal)
	}

	return {
		...(activationBlock != null && { activationBlock }),
		...(activationTimestampMs != null && { activationTimestampMs }),
		...(activationEpoch != null && { activationEpoch }),
		...(linkedProposals.length > 0 && { $$proposals: linkedProposals }),
	}
}

export const enrichNetworkExecutionUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.EthereumExecutionUpgrade>,
): Promise<Entity<typeof schema, EntityType.EthereumExecutionUpgrade>> => {
	if (row.activationTimestampMs != null)
		return {
			...row,
			activationTimestampMs: activationTimestampMsFromSecondsOrMs(row.activationTimestampMs),
		}

	if (row.activationBlock != null) {
		const activationTimestampMs = await executionBlockActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationBlock,
		)
		return (
			activationTimestampMs == null ?
				row
			:
				{
					...row,
					activationTimestampMs,
				}
		)
	}
	if (row.activationEpoch != null) {
		const activationTimestampMs = await consensusEpochActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationEpoch,
		)
		return (
			activationTimestampMs == null ?
				row
			:
				{
					...row,
					activationTimestampMs,
				}
		)
	}
	return row
}

export const enrichNetworkConsensusUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.EthereumConsensusUpgrade>,
): Promise<Entity<typeof schema, EntityType.EthereumConsensusUpgrade>> => {
	if (row.activationTimestampMs != null)
		return {
			...row,
			activationTimestampMs: activationTimestampMsFromSecondsOrMs(row.activationTimestampMs),
		}

	if (row.activationEpoch != null) {
		const activationTimestampMs = await consensusEpochActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationEpoch,
		)
		return (
			activationTimestampMs == null ?
				row
			:
				{
					...row,
					activationTimestampMs,
				}
		)
	}
	if (row.activationBlock != null) {
		const activationTimestampMs = await executionBlockActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationBlock,
		)
		return (
			activationTimestampMs == null ?
				row
			:
				{
					...row,
					activationTimestampMs,
				}
		)
	}
	return row
}

export const enrichNetworkUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>,
): Promise<Entity<typeof schema, EntityType.EthereumNetworkUpgrade>> => {
	const {
		networkExecutionUpgradeByChainIdAndUpgradeId,
		networkConsensusUpgradeByChainIdAndUpgradeId,
	} = await import('$/constants/EthereumNetworkUpgrades.ts')
	const executionRow = (
		row.$networkExecutionUpgrade == null ?
			null
		:
			networkExecutionUpgradeByChainIdAndUpgradeId[
			`${row.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${row.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
		]
	)
	const consensusRow = (
		row.$networkConsensusUpgrade == null ?
			null
		:
			networkConsensusUpgradeByChainIdAndUpgradeId[
			`${row.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${row.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
		]
	)
	const activationTimestampMs = (
		[
			row.activationTimestampMs,
			(
				executionRow == null ?
					undefined
				:
					(await enrichNetworkExecutionUpgradeActivationTimestamp(executionRow)).activationTimestampMs
			),
			(
				consensusRow == null ?
					undefined
				:
					(await enrichNetworkConsensusUpgradeActivationTimestamp(consensusRow)).activationTimestampMs
			),
		]
			.filter((timestamp): timestamp is number => timestamp != null)
			.reduce(
				(latest, timestamp) => (
					timestamp > latest ?
						timestamp
					:
						latest
				),
				-Infinity,
			)
	)
	return (
		activationTimestampMs > -Infinity ?
			{
				...row,
				activationTimestampMs,
			}
		:
			row
	)
}

export const enrichNetworkUpgradeRowsActivationTimestamp = async (
	rows: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>[],
): Promise<Entity<typeof schema, EntityType.EthereumNetworkUpgrade>[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkUpgradeActivationTimestamp(row)),
	)
)
