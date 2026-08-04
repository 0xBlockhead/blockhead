import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.hoisted(() => vi.fn())
const getBlockMessages = vi.hoisted(() => vi.fn())
const getMessage = vi.hoisted(() => vi.fn())
const getTipset = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Filfox/Rest/queries.ts', () => ({
	getBlock,
	getBlockMessages,
	getMessage,
	getTipset,
}))

const { default: filfoxRest } = await import('$/resolvers/Filfox-Rest.ts')

const network = {
	slug: networkBySlug.filecoin.slug,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 8,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [Source.Filfox_Rest],
	publicEnv: {},
}

const tipsetResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinTipset
))
const blockResolvers = filfoxRest.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.FilecoinBlock
))
const blockResolver = blockResolvers.find((resolver) => (
	'$tipset' in resolver.projections
))
const blockMessagesResolver = blockResolvers.find((resolver) => (
	'$$messages' in resolver.projections
))
const messageResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMessage
))

if (
	tipsetResolver == null
	|| blockResolver == null
	|| blockMessagesResolver == null
	|| messageResolver == null
)
	throw new Error('Filfox-Rest spec missing required resolvers')

describe('Filfox REST resolvers', () => {
	beforeEach(() => {
		getBlock.mockReset()
		getBlockMessages.mockReset()
		getMessage.mockReset()
		getTipset.mockReset()
	})

	it('registers tipset, block, message, and block-message product surfaces without actor state', () => {
		expect(filfoxRest.source).toBe(Source.Filfox_Rest)
		expect(filfoxRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.FilecoinTipset,
			EntityType.FilecoinBlock,
			EntityType.FilecoinMessage,
			EntityType.FilecoinBlock,
		])
		expect(filfoxRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.FilecoinActor
			|| resolver.entityType === EntityType.FilecoinActor_Timestamp
			|| resolver.entityType === EntityType.FilecoinMiner
		))).toBe(false)
	})

	it('rejects non-Filecoin networks before HTTP', async () => {
		await expect(tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
			$network: {
				slug: 'ethereum',
			},
			height: 1n,
			tipsetKey: 'bafy-a',
		}, context)).rejects.toThrow('Filfox_Rest: unsupported network')
		expect(getTipset).not.toHaveBeenCalled()
	})

	it('resolves tipset blocks and parent weight when the tipset key matches', async () => {
		getTipset.mockResolvedValueOnce({
			height: 10,
			timestamp: 1_700_000_000,
			blocks: [
				{
					cid: 'bafy-a',
					miner: 'f01',
					winCount: 1,
				},
				{
					cid: 'bafy-b',
					miner: 'f02',
				},
			],
		})
		getBlock.mockResolvedValueOnce({
			cid: 'bafy-a',
			height: 10,
			timestamp: 1_700_000_000,
			miner: 'f01',
			winCount: 1,
			parents: [
				'bafy-parent-a',
				'bafy-parent-b',
			],
			parentWeight: '99',
			messageCount: 2,
		})

		const snapshot = await tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
			$network: network,
			height: 10n,
			tipsetKey: 'bafy-a,bafy-b',
		}, context)

		expect(tipsetResolver.projections.timestampMs(snapshot)).toBe(1_700_000_000_000)
		expect(tipsetResolver.projections.parentWeight(snapshot)).toBe(99n)
		expect(tipsetResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 9n,
				tipsetKey: 'bafy-parent-a,bafy-parent-b',
			},
		})
		expect(tipsetResolver.projections.$$blocks(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					cid: 'bafy-a',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							height: 10n,
							tipsetKey: 'bafy-a,bafy-b',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							minerAddress: 'f01',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'winCount')]: 1,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					cid: 'bafy-b',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							height: 10n,
							tipsetKey: 'bafy-a,bafy-b',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							minerAddress: 'f02',
						},
					},
				},
			},
		])
	})

	it('hard-fails mismatched tipset keys without soft-emptying blocks', async () => {
		getTipset.mockResolvedValueOnce({
			height: 10,
			timestamp: 1_700_000_000,
			blocks: [{
				cid: 'bafy-a',
				miner: 'f01',
			}],
		})

		await expect(tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
			$network: network,
			height: 10n,
			tipsetKey: 'bafy-other',
		}, context)).rejects.toThrow('Filfox_Rest: tipset does not match 10/bafy-other')
		expect(getBlock).not.toHaveBeenCalled()
	})

	it('projects message from/to fields from one Filfox message response', async () => {
		getMessage.mockResolvedValueOnce({
			cid: 'bafy-msg',
			from: 'f1from',
			to: 'f1to',
			nonce: 3,
			value: '1000',
			method: 'Send',
			methodNumber: 0,
			gasLimit: 50_000_000,
		})

		const snapshot = await messageResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafy-msg',
		}, context)

		expect(messageResolver.projections.$from(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'f1from',
			},
		})
		expect(messageResolver.projections.$to(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'f1to',
			},
		})
		expect(messageResolver.projections.method(snapshot)).toBe(0)
		expect(messageResolver.projections.nonce(snapshot)).toBe(3n)
		expect(messageResolver.projections.valueAttoFil(snapshot)).toBe(1000n)
		expect(messageResolver.projections.gasLimit(snapshot)).toBe(50_000_000n)
	})

	it('propagates hard-fail HTTP from message lookup', async () => {
		getMessage.mockRejectedValueOnce(new Error('GET https://filfox.info/api/v1/message/missing → 404'))

		await expect(messageResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'missing',
		}, context)).rejects.toThrow('404')
	})

	it('lists block messages with nested field enrichment', async () => {
		getBlockMessages.mockResolvedValueOnce({
			totalCount: 1,
			messages: [{
				cid: 'bafy-msg',
				from: 'f1from',
				to: 'f1to',
				nonce: 1,
				value: '2',
				method: 'Send',
			}],
		})

		const snapshot = await blockMessagesResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafy-block',
		}, context)

		expect(blockMessagesResolver.projections.$$messages(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					cid: 'bafy-msg',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], '$from')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: 'f1from',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], '$to')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: 'f1to',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'nonce')]: 1n,
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'valueAttoFil')]: 2n,
				},
			},
		])
		expect(getBlockMessages).toHaveBeenCalledWith({
			blockCid: 'bafy-block',
			pageSize: 8,
		})
	})

	it('resolves block tipset and miner from block + tipset fetches', async () => {
		getBlock.mockResolvedValueOnce({
			cid: 'bafy-block',
			height: 11,
			timestamp: 1_700_000_030,
			miner: 'f03',
			winCount: 2,
			parents: ['bafy-p'],
			parentWeight: '1',
			messageCount: 0,
		})
		getTipset.mockResolvedValueOnce({
			height: 11,
			timestamp: 1_700_000_030,
			blocks: [
				{
					cid: 'bafy-block',
					miner: 'f03',
				},
				{
					cid: 'bafy-sib',
					miner: 'f04',
				},
			],
		})

		const snapshot = await blockResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafy-block',
		}, context)

		expect(blockResolver.projections.$tipset(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 11n,
				tipsetKey: 'bafy-block,bafy-sib',
			},
		})
		expect(blockResolver.projections.$miner(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				minerAddress: 'f03',
			},
		})
		expect(blockResolver.projections.winCount(snapshot)).toBe(2)
	})
})
