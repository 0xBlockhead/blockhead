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
	getBlockHeader,
	getIdAddress,
	getMarketStorageDeal,
	getMinerActiveSectors,
	getMinerInfo,
	getMinerPower,
	getMinerSectorCount,
	getMinerSectors,
	replayMessage,
	searchMessage,
	getTipSet,
	getTipSetByHeight,
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
	ControlAddresses: ['f01057931'],
	Beneficiary: 'f3owner',
	SectorSize: 34359738368,
	BeneficiaryTerm: {
		Quota: '0',
		UsedQuota: '0',
		Expiration: 0,
	},
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

const tipsetEnvelope = {
	Cids: tipsetKey,
	Blocks: [{
		Miner: 'f01234',
		Parents: [],
		ParentWeight: '0',
		Height: 100,
		Timestamp: 1_750_000_000,
		Messages: { '/': 'bafy2bzacemessages' },
	}],
	Height: 100,
}

const blockHeaderEnvelope = {
	Miner: 'f01234',
	Ticket: {
		VRFProof: 'ticket-proof',
	},
	ElectionProof: {
		WinCount: 2,
	},
	Parents: tipsetKey,
	ParentWeight: '0',
	Height: 101,
	Timestamp: 1_750_000_030,
	Messages: {
		'/': 'bafy2bzacemessages',
	},
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
		await expect(getMinerInfo({
			minerAddress: 'f01234',
			tipsetKey,
		})).resolves.toMatchObject({
			Owner: 'f3owner',
			Worker: 'f3worker',
			PeerId: '12D3KooW',
			ControlAddresses: ['f01057931'],
			Beneficiary: 'f3owner',
			SectorSize: 34359738368,
			BeneficiaryTerm: {
				Quota: '0',
				UsedQuota: '0',
				Expiration: 0,
			},
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

	it('reads a historical block header by its CID', async () => {
		fetchMock.mockResolvedValueOnce(rpcResponse(blockHeaderEnvelope))

		await expect(getBlockHeader({
			blockCid: 'bafy2bzacehistoricalblock',
		})).resolves.toEqual(blockHeaderEnvelope)
		expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.ChainGetBlock',
				params: [{
					'/': 'bafy2bzacehistoricalblock',
				}],
			},
		])
	})

	it('finds and replays a message at its authoritative tipset', async () => {
		const lookup = {
			Message: { '/': 'bafy-message' },
			Receipt: {
				ExitCode: 0,
				Return: '',
				GasUsed: 10,
			},
			TipSet: tipsetKey,
			Height: 100,
		}
		const message = {
			Version: 0,
			To: 'f1to',
			From: 'f1from',
			Nonce: 1,
			Value: '1',
			GasLimit: 100,
			GasFeeCap: '2',
			GasPremium: '1',
			Method: 0,
			Params: '',
		}
		const replay = {
			MsgCid: { '/': 'bafy-message' },
			Msg: message,
			MsgRct: lookup.Receipt,
			ExecutionTrace: {
				Msg: message,
				MsgRct: lookup.Receipt,
				Subcalls: [],
			},
			Error: '',
			Duration: 25,
		}
		fetchMock
			.mockResolvedValueOnce(rpcResponse(lookup))
			.mockResolvedValueOnce(rpcResponse(replay))

		await expect(searchMessage({
			messageCid: 'bafy-message',
		})).resolves.toEqual(lookup)
		await expect(replayMessage({
			messageCid: 'bafy-message',
			tipsetKey,
		})).resolves.toEqual(replay)
		expect(fetchMock.mock.calls.map(([, init]) => JSON.parse(String(init?.body)))).toEqual([
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateSearchMsg',
				params: [
					null,
					{ '/': 'bafy-message' },
					-1,
					true,
				],
			},
			{
				jsonrpc: '2.0',
				id: 1,
				method: 'Filecoin.StateReplay',
				params: [
					tipsetKey,
					{ '/': 'bafy-message' },
				],
			},
		])
	})

	it('distinguishes missing, malformed, and replaced message lookups', async () => {
		fetchMock
			.mockResolvedValueOnce(rpcResponse(null))
			.mockResolvedValueOnce(rpcResponse({ Message: { '/': 'bafy-message' } }))
			.mockResolvedValueOnce(rpcResponse({
				Message: { '/': 'bafy-replacement' },
				Receipt: {
					ExitCode: 0,
					Return: '',
					GasUsed: 10,
				},
				TipSet: tipsetKey,
				Height: 100,
			}))

		await expect(searchMessage({ messageCid: 'bafy-message' })).rejects.toThrow('was not found on chain')
		await expect(searchMessage({ messageCid: 'bafy-message' })).rejects.toThrow('message lookup')
		await expect(searchMessage({ messageCid: 'bafy-message' })).rejects.toThrow('message lookup identity does not match request')
	})

	it('propagates message search RPC and transport failures', async () => {
		fetchMock.mockResolvedValueOnce(Response.json({
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -32000,
				message: 'lookup unavailable',
			},
		}))
		await expect(searchMessage({ messageCid: 'bafy-message' })).rejects.toThrow('lookup unavailable')
		const failure = new Error('connection closed')
		fetchMock.mockRejectedValueOnce(failure)
		await expect(searchMessage({ messageCid: 'bafy-message' })).rejects.toBe(failure)
	})

	it('rejects duplicate sector numbers for a miner', async () => {
		const duplicateSectorEnvelope = [sectorEnvelope, sectorEnvelope]
		fetchMock
			.mockResolvedValueOnce(rpcResponse(duplicateSectorEnvelope))
			.mockResolvedValueOnce(rpcResponse(duplicateSectorEnvelope))

		await expect(getMinerSectors({
			minerAddress: 'f01234',
			tipsetKey,
		})).rejects.toThrow('Lotus_JsonRpc: miner sectors contains duplicate sector number')
		await expect(getMinerActiveSectors({
			minerAddress: 'f01234',
			tipsetKey,
		})).rejects.toThrow('Lotus_JsonRpc: miner active sectors contains duplicate sector number')
	})

	it('binds tipset responses to their requested height and key', async () => {
		fetchMock
			.mockResolvedValueOnce(rpcResponse({
				...tipsetEnvelope,
				Height: 99,
			}))
			.mockResolvedValueOnce(rpcResponse({
				...tipsetEnvelope,
				Height: 101,
			}))
			.mockResolvedValueOnce(rpcResponse({
				...tipsetEnvelope,
				Cids: [{
					'/': 'bafy2bzaceother',
				}],
			}))

		await expect(getTipSetByHeight({
			height: 100n,
		})).resolves.toMatchObject({ Height: 99 })
		await expect(getTipSetByHeight({
			height: 100n,
		})).rejects.toThrow('tipset response height exceeds request')
		await expect(getTipSet({ tipsetKey })).rejects.toThrow('tipset response key does not match request')

		await expect(getTipSetByHeight({
			height: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
		})).rejects.toThrow('invalid tipset height')
		expect(fetchMock).toHaveBeenCalledTimes(3)
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
