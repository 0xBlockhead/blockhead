import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getActor,
	getIdAddress,
	getMarketStorageDeal,
	getMinerActiveSectors,
	getMinerInfo,
	getMinerPower,
	getMinerSectorCount,
	getMinerSectors,
} from '$/sources/Lotus/JsonRpc/queries.ts'

const fetchMock = vi.fn<typeof fetch>()

const tipsetKey = [
	{
		'/': 'bafy2bzacehead',
	},
]

const rpcResponse = (result: unknown) => new Response(JSON.stringify({
	jsonrpc: '2.0',
	id: 1,
	result,
}), {
	headers: {
		'content-type': 'application/json',
	},
})

const actorEnvelope = {
	Code: { '/': 'bafy2bzaceactorcode' },
	Head: { '/': 'bafy2bzaceactorhead' },
	Nonce: 1,
	Balance: '1000',
}

const minerInfoEnvelope = {
	Owner: 'f3owner',
	Worker: 'f3worker',
	PeerId: '12D3KooW',
}

const minerPowerEnvelope = {
	MinerPower: {
		RawBytePower: '10',
		QualityAdjPower: '20',
	},
	TotalPower: {
		RawBytePower: '100',
		QualityAdjPower: '200',
	},
	HasMinPower: true,
}

const sectorEnvelope = {
	SectorNumber: 1,
	Activation: 10,
	Expiration: 20,
}

const sectorCountEnvelope = {
	Live: 1,
	Active: 1,
	Faulty: 0,
	Total: 1,
}

const dealEnvelope = {
	Proposal: {
		PieceCID: { '/': 'baga-piece' },
		PieceSize: 2048,
		VerifiedDeal: true,
		Client: 'f1client',
		Provider: 'f01000',
		StartEpoch: 10,
		EndEpoch: 20,
		StoragePricePerEpoch: '3',
		ProviderCollateral: '5',
		ClientCollateral: '4',
	},
	State: {
		SectorStartEpoch: 11,
		LastUpdatedEpoch: 12,
		SlashEpoch: -1,
	},
}

describe('Lotus JSON-RPC state queries', () => {
	beforeEach(() => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('fetch', fetchMock)
		fetchMock.mockReset()
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('uses one explicit tipset for actor, miner, sector, and count state', async () => {
		fetchMock
			.mockResolvedValueOnce(rpcResponse(actorEnvelope))
			.mockResolvedValueOnce(rpcResponse('f01234'))
			.mockResolvedValueOnce(rpcResponse(minerInfoEnvelope))
			.mockResolvedValueOnce(rpcResponse(minerPowerEnvelope))
			.mockResolvedValueOnce(rpcResponse([sectorEnvelope]))
			.mockResolvedValueOnce(rpcResponse([sectorEnvelope]))
			.mockResolvedValueOnce(rpcResponse(sectorCountEnvelope))

		await getActor({
			address: 'f01234',
			tipsetKey,
		})
		await getIdAddress({
			address: 'f1robust',
			tipsetKey,
		})
		await getMinerInfo({
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerPower({
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerSectors({
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerActiveSectors({
			minerAddress: 'f01234',
			tipsetKey,
		})
		await getMinerSectorCount({
			minerAddress: 'f01234',
			tipsetKey,
		})

		expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(
			Array.from({ length: 7 }, () => 'https://api.node.glif.io/rpc/v1')
		)
		expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateGetActor',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateLookupID',
				params: ['f1robust', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerInfo',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerPower',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerSectors',
				params: ['f01234', null, tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerActiveSectors',
				params: ['f01234', tipsetKey],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMinerSectorCount',
				params: ['f01234', tipsetKey],
			},
		])
	})

	it('reads a market storage deal at head or tipset', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse(dealEnvelope))

		await expect(getMarketStorageDeal({
			dealId: 42n,
			tipsetKey,
		})).resolves.toMatchObject({
			Proposal: {
				Provider: 'f01000',
				PieceSize: 2048,
			},
			State: {
				SectorStartEpoch: 11,
			},
		})
		expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateMarketStorageDeal',
				params: [42, tipsetKey],
			},
		])
	})

	it('fail-closes malformed actor, miner, and deal envelopes', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse({
			Code: { '/': 'bafy' },
		}))
		await expect(getActor({
			address: 'f01234',
			tipsetKey,
		})).rejects.toThrow('Lotus_JsonRpc: invalid actor response envelope')

		fetchMock.mockResolvedValueOnce(rpcResponse({
			Owner: 'f3owner',
		}))
		await expect(getMinerInfo({
			minerAddress: 'f01234',
			tipsetKey,
		})).rejects.toThrow('Lotus_JsonRpc: invalid miner-info response envelope')

		fetchMock.mockResolvedValueOnce(rpcResponse({
			Proposal: dealEnvelope.Proposal,
		}))
		await expect(getMarketStorageDeal({
			dealId: 42n,
			tipsetKey,
		})).rejects.toThrow('Lotus_JsonRpc: invalid market-storage-deal response envelope')
	})
})
