import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const connectionId = 'codex-node'

const loadCodexNodeQueries = async () => {
	if (typeof window !== 'undefined')
		return import('$/sources/CodexNode/Rest/queries.remote.ts')

	const [
		{ default: bindings },
		queries,
	] = await Promise.all([
		import('$/sources/CodexNode/bindings.ts'),
		import('$/sources/CodexNode/Rest/queries.ts'),
	])
	const binding = bindings[Source.CodexNode_Rest][0]

	return {
		getEndpoint: async () => binding.endpoints[0].locator,
		getPeerId: () => queries.getPeerId(binding),
		listData: () => queries.listData(binding),
	}
}

const verifiedNodeQueries = async ({
	connectionId: requestedConnectionId,
	peerId,
}: {
	connectionId: string
	peerId: string
}) => {
	if (requestedConnectionId !== connectionId)
		throw new Error(`CodexNode_Rest: unsupported connection ${requestedConnectionId}`)

	const queries = await loadCodexNodeQueries()
	const remotePeerId = await queries.getPeerId()
	if (remotePeerId !== peerId)
		throw new Error(`CodexNode_Rest: local peer ${remotePeerId} does not match ${peerId}`)

	return queries
}

export default {
	source: Source.CodexNode_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadCodexStorageNodeState,
			resolve: {
				ConnectionIdPeerId: {
					resolve: async ({ connectionId: requestedConnectionId, peerId }) => {
						const $nodeState = {
							connectionId: requestedConnectionId,
							peerId,
						}
						const queries = await verifiedNodeQueries($nodeState)
						const [
							data,
							endpoint,
						] = await Promise.all([
							queries.listData(),
							queries.getEndpoint(),
						])

						return {
							...$nodeState,
							endpoint,
							$$storedData: data.map(({ cid }) => ({
								[EntityMetaKey.Selector]: {
									$nodeState,
									cid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BlockheadCodexStoredData, [], '$dataset')]: {
										[EntityMetaKey.Selector]: { cid },
									},
								},
							})),
						}
					},
				},
			},
		})({
			connectionId: (nodeState) => nodeState.connectionId,
			peerId: (nodeState) => nodeState.peerId,
			endpoint: (nodeState) => nodeState.endpoint,
			$$storedData: {
				select: (nodeState) => nodeState.$$storedData,
				resolveCount: (nodeState) => nodeState.$$storedData.length,
			},
		}),

		defineResolver({
			entityType: EntityType.BlockheadCodexStoredData,
			resolve: {
				NodeStateCid: {
					resolve: async ({ $nodeState, cid }) => {
						const queries = await verifiedNodeQueries($nodeState)
						const item = (await queries.listData()).find((candidate) => candidate.cid === cid)
						if (item == null)
							throw new Error(`CodexNode_Rest: stored data not found for ${cid}`)

						return {
							$nodeState: {
								[EntityMetaKey.Selector]: $nodeState,
							},
							cid,
							$dataset: {
								[EntityMetaKey.Selector]: { cid },
							},
						}
					},
				},
			},
		})({
			$nodeState: (storedData) => storedData.$nodeState,
			cid: (storedData) => storedData.cid,
			$dataset: (storedData) => storedData.$dataset,
		}),

		defineResolver({
			entityType: EntityType.CodexDataset,
			resolve: {
				Cid: {
					resolve: async ({ cid }) => {
						const { listData } = await loadCodexNodeQueries()
						const item = (await listData()).find((candidate) => candidate.cid === cid)
						if (item == null)
							throw new Error(`CodexNode_Rest: dataset not found for ${cid}`)

						return {
							cid,
							treeCid: item.manifest.treeCid,
							datasetSizeBytes: BigInt(item.manifest.datasetSize),
							blockSizeBytes: item.manifest.blockSize,
							...(item.manifest.filename != null && {
								filename: item.manifest.filename,
							}),
							...(item.manifest.mimetype != null && {
								mimetype: item.manifest.mimetype,
							}),
						}
					},
				},
			},
		})({
			cid: (dataset) => dataset.cid,
			treeCid: (dataset) => dataset.treeCid,
			datasetSizeBytes: (dataset) => dataset.datasetSizeBytes,
			blockSizeBytes: (dataset) => dataset.blockSizeBytes,
			filename: (dataset) => dataset.filename,
			mimetype: (dataset) => dataset.mimetype,
		}),
	],
} satisfies RegisteredSourceResolverModule
