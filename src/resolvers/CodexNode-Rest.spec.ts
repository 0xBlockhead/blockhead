import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const {
	getPeerId,
	listData,
} = vi.hoisted(() => ({
	getPeerId: vi.fn(),
	listData: vi.fn(),
}))

vi.mock('$/sources/CodexNode/Rest/queries.ts', () => ({
	getPeerId,
	listData,
}))

const { default: resolverModule } = await import('$/resolvers/CodexNode-Rest.ts')
const nodeStateResolver = resolverModule.resolvers.find(({ entityType }) => (
	entityType === EntityType.BlockheadCodexStorageNodeState
))
const storedDataResolver = resolverModule.resolvers.find(({ entityType }) => (
	entityType === EntityType.BlockheadCodexStoredData
))
const datasetResolver = resolverModule.resolvers.find(({ entityType }) => (
	entityType === EntityType.CodexDataset
))

if (
	nodeStateResolver == null
	|| !('ConnectionIdPeerId' in nodeStateResolver.resolve)
	|| storedDataResolver == null
	|| !('NodeStateCid' in storedDataResolver.resolve)
	|| datasetResolver == null
	|| !('Cid' in datasetResolver.resolve)
)
	throw new Error('CodexNode_Rest resolvers are incomplete')

const peerId = '16Uiu2HAmJ3TSfPnrJNedHy2DMsjTqwBiVAQQqPo579DuMgGxmG99'
const cid = 'bafkreiebiy6fwcvo54p6hc4ckpqmzyq4jlgdjxhhbxnkebcrxzmb5aao4u'
const treeCid = 'bafkreic3exm3kve5n7nqzqkde6m6v7dbs2kclu4w6ynw5x6f3xqfhlxk4e'
const datasetSize = 8_000_000_000_000_000
const dataItem = {
	cid,
	manifest: {
		treeCid,
		datasetSize,
		blockSize: 65_536,
		filename: 'archive.car',
		mimetype: 'application/vnd.ipld.car',
	},
}
const $nodeState = {
	connectionId: 'codex-node',
	peerId,
}

beforeEach(() => {
	vi.clearAllMocks()
	getPeerId.mockResolvedValue(peerId)
	listData.mockResolvedValue([dataItem])
})

describe('Codex node canonical reads', () => {
	it('materializes the verified node and current stored-data memberships', async () => {
		const snapshot = await nodeStateResolver.resolve.ConnectionIdPeerId.resolve($nodeState)

		expect(snapshot).toMatchObject({
			...$nodeState,
			endpoint: 'http://127.0.0.1:8080',
		})
		expect(nodeStateResolver.projections.$$storedData.resolveCount(snapshot)).toBe(1)
		expect(nodeStateResolver.projections.$$storedData.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$nodeState,
				cid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadCodexStoredData, [], '$dataset')]: {
					[EntityMetaKey.Selector]: { cid },
				},
			},
		}])
		expect(snapshot).not.toHaveProperty('$$timestamps')
	})

	it('resolves a stored membership to its dataset without availability claims', async () => {
		const snapshot = await storedDataResolver.resolve.NodeStateCid.resolve({
			$nodeState,
			cid,
		})

		expect(storedDataResolver.projections.$nodeState(snapshot)).toEqual({
			[EntityMetaKey.Selector]: $nodeState,
		})
		expect(storedDataResolver.projections.$dataset(snapshot)).toEqual({
			[EntityMetaKey.Selector]: { cid },
		})
		expect(snapshot).not.toHaveProperty('firstSeenAt')
		expect(snapshot).not.toHaveProperty('$$timestamps')
	})

	it('preserves manifest metadata and converts the large dataset size to bigint', async () => {
		const snapshot = await datasetResolver.resolve.Cid.resolve({ cid })

		expect(snapshot).toEqual({
			cid,
			treeCid,
			datasetSizeBytes: 8_000_000_000_000_000n,
			blockSizeBytes: 65_536,
			filename: 'archive.car',
			mimetype: 'application/vnd.ipld.car',
		})
		expect(snapshot).not.toHaveProperty('$$localCopies')
	})

	it('omits null manifest optionals', async () => {
		listData.mockResolvedValueOnce([{
			...dataItem,
			manifest: {
				...dataItem.manifest,
				filename: null,
				mimetype: null,
			},
		}])

		const snapshot = await datasetResolver.resolve.Cid.resolve({ cid })

		expect(snapshot).not.toHaveProperty('filename')
		expect(snapshot).not.toHaveProperty('mimetype')
	})

	it('preserves a valid empty membership snapshot', async () => {
		listData.mockResolvedValueOnce([])

		const snapshot = await nodeStateResolver.resolve.ConnectionIdPeerId.resolve($nodeState)

		expect(nodeStateResolver.projections.$$storedData.select(snapshot)).toEqual([])
		expect(nodeStateResolver.projections.$$storedData.resolveCount(snapshot)).toBe(0)
	})

	it('rejects unsupported connections before reading the node', async () => {
		await expect(nodeStateResolver.resolve.ConnectionIdPeerId.resolve({
			connectionId: 'other-node',
			peerId,
		})).rejects.toThrow('CodexNode_Rest: unsupported connection other-node')
		expect(getPeerId).not.toHaveBeenCalled()
		expect(listData).not.toHaveBeenCalled()
	})

	it('rejects a requested peer that does not match the configured node', async () => {
		getPeerId.mockResolvedValueOnce('different-peer')

		await expect(nodeStateResolver.resolve.ConnectionIdPeerId.resolve($nodeState)).rejects.toThrow(
			`CodexNode_Rest: local peer different-peer does not match ${peerId}`
		)
		expect(listData).not.toHaveBeenCalled()
	})

	it('rejects absent stored-data and dataset identities', async () => {
		await expect(storedDataResolver.resolve.NodeStateCid.resolve({
			$nodeState,
			cid: 'missing-cid',
		})).rejects.toThrow('CodexNode_Rest: stored data not found for missing-cid')

		await expect(datasetResolver.resolve.Cid.resolve({
			cid: 'missing-cid',
		})).rejects.toThrow('CodexNode_Rest: dataset not found for missing-cid')
	})
})
