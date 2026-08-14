import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getMessage = vi.hoisted(() => vi.fn())
const replayMessage = vi.hoisted(() => vi.fn())
const searchMessage = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Lotus/JsonRpc/queries.ts', () => ({
	getMessage,
	replayMessage,
	searchMessage,
}))

const { default: lotusJsonRpc } = await import('$/resolvers/Lotus-JsonRpc.ts')

const messageResolver = lotusJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMessage
))
const receiptResolver = lotusJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMessageReceipt
))
const subcallResolver = lotusJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMessageSubcall
))

if (messageResolver == null)
	throw new Error('Lotus-JsonRpc spec missing FilecoinMessage resolver')
if (receiptResolver == null)
	throw new Error('Lotus-JsonRpc spec missing FilecoinMessageReceipt resolver')
if (subcallResolver == null)
	throw new Error('Lotus-JsonRpc spec missing FilecoinMessageSubcall resolver')

const network = {
	slug: networkBySlug.filecoin.slug,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [Source.Lotus_JsonRpc],
	publicEnv: {},
}

describe('Lotus JsonRpc FilecoinMessage', () => {
	beforeEach(() => {
		getMessage.mockReset()
		replayMessage.mockReset()
		searchMessage.mockReset()
	})

	it('maps ChainGetMessage into FilecoinMessage fields', async () => {
		getMessage.mockResolvedValueOnce({
			Version: 0,
			To: 'f1to',
			From: 'f1from',
			Nonce: 7,
			Value: '1000',
			GasLimit: 50_000_000,
			GasFeeCap: '100',
			GasPremium: '10',
			Method: 2,
			Params: '',
		})
		searchMessage.mockResolvedValueOnce({
			Message: { '/': 'bafyMessage' },
			Receipt: {
				ExitCode: 0,
				Return: 'lookup-return',
				GasUsed: 120,
			},
			TipSet: [{ '/': 'bafyTipset' }],
			Height: 123,
		})
		replayMessage.mockResolvedValueOnce({
			MsgCid: { '/': 'bafyMessage' },
			Msg: {},
			MsgRct: {
				ExitCode: 0,
				Return: 'replay-return',
				GasUsed: 125,
			},
			ExecutionTrace: {
				Msg: {},
				MsgRct: {},
				Subcalls: [{
					Msg: {
						From: 'f1subfrom',
						To: 'f1subto',
						Value: '40',
						Method: 3,
						Params: 'params',
					},
					MsgRct: {
						ExitCode: 1,
						Return: 'sub-return',
						GasUsed: 25,
					},
				}],
			},
		})
		const snapshot = await messageResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafyMessage',
		}, context)
		expect(snapshot).toEqual({
			$from: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: 'f1from',
				},
			},
			$to: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: 'f1to',
				},
			},
			method: 2,
			nonce: 7n,
			valueAttoFil: 1000n,
			gasLimit: 50_000_000n,
			$receipt: expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({
					tipsetKey: 'bafyTipset',
					source: Source.Lotus_JsonRpc,
				}),
			}),
			$$subcalls: [expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({
					index: 0,
				}),
			})],
		})
		expect(messageResolver.projections.$$subcalls.select(snapshot)).toHaveLength(1)
		expect(messageResolver.projections.$$subcalls.resolveCount(snapshot)).toBe(1)
		expect(getMessage).toHaveBeenCalledWith({
			messageCid: 'bafyMessage',
		})
	})

	it('resolves exact receipt and subcall selectors from one authoritative replay', async () => {
		const message = {
			Version: 0,
			To: 'f1to',
			From: 'f1from',
			Nonce: 7,
			Value: '1000',
			GasLimit: 50_000_000,
			GasFeeCap: '100',
			GasPremium: '10',
			Method: 2,
			Params: '',
		}
		const lookup = {
			Message: { '/': 'bafyMessage' },
			Receipt: { ExitCode: 0, Return: '', GasUsed: 9 },
			TipSet: [{ '/': 'bafyTipset' }],
			Height: 123,
		}
		const replay = {
			MsgCid: { '/': 'bafyMessage' },
			Msg: message,
			MsgRct: { ExitCode: 0, Return: 'result', GasUsed: 10 },
			ExecutionTrace: {
				Msg: message,
				MsgRct: { ExitCode: 0, Return: 'result', GasUsed: 10 },
				Subcalls: [{
					Msg: {
						...message,
						From: 'f1subfrom',
						To: 'f1subto',
						Value: '2',
						Method: 4,
						Params: 'sub-params',
					},
					MsgRct: { ExitCode: 2, Return: 'sub-result', GasUsed: 3 },
				}],
			},
		}
		getMessage.mockResolvedValue(message)
		searchMessage.mockResolvedValue(lookup)
		replayMessage.mockResolvedValue(replay)

		await expect(receiptResolver.resolve.MessageTipsetKeySource.resolve({
			$message: {
				$network: network,
				cid: 'bafyMessage',
			},
			tipsetKey: 'bafyTipset',
			source: Source.Lotus_JsonRpc,
		}, context)).resolves.toEqual({
			$tipset: {
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 123n,
					tipsetKey: 'bafyTipset',
				},
			},
			height: 123n,
			exitCode: 0,
			returnData: 'result',
			gasUsed: 10n,
		})
		await expect(subcallResolver.resolve.MessageIndex.resolve({
			$message: {
				$network: network,
				cid: 'bafyMessage',
			},
			index: 0,
		}, context)).resolves.toMatchObject({
			valueAttoFil: 2n,
			method: '4',
			methodNumber: 4,
			params: 'sub-params',
			exitCode: 2,
			returnData: 'sub-result',
			gasUsed: 3n,
		})
	})
})
