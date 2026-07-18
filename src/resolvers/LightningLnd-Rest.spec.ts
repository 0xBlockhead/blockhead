import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { BlockheadLightningNodeStateSelector } from '$/schema/BlockheadLightningNodeState.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getInfo = vi.hoisted(() => vi.fn())

vi.mock('$/sources/LightningLnd/Rest/queries.ts', () => ({
	getInfo,
	listChannels: vi.fn(),
	listInvoices: vi.fn(),
	listPayments: vi.fn(),
}))

const { default: lightningLnd } = await import('$/resolvers/LightningLnd-Rest.ts')

const resolver = lightningLnd.resolvers.find((
	candidate
): candidate is Extract<
	typeof lightningLnd.resolvers[number],
	{ entityType: EntityType.BlockheadLightningNodeState }
> => candidate.entityType === EntityType.BlockheadLightningNodeState)

if (resolver == null)
	throw new Error('LightningLnd-Rest spec missing local node-state resolver')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_LND_MACAROON_HEX: 'macaroon',
	},
}

describe('Lightning LND local node-state ownership', () => {
	beforeEach(() => {
		getInfo.mockReset()
	})

	it('materializes the exact connection and provider-owned node identity', async () => {
		getInfo.mockResolvedValueOnce({
			identity_pubkey: '02localnode',
			alias: 'Blockhead LND',
			num_active_channels: 3,
		})

		const state = await resolver.resolve[
			BlockheadLightningNodeStateSelector.ConnectionIdNetwork
			].resolve({
				connectionId: 'local-lnd',
				$network: {
					$network: {
						slug: 'lightning',
					},
				},
			}, context)

		expect(state).toEqual({
			connectionId: 'local-lnd',
			$network: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'lightning',
					},
				},
			},
			lndPubkey: '02localnode',
			alias: 'Blockhead LND',
			$node: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'lightning',
					},
					publicKey: '02localnode',
				},
			},
		})
		expect(getInfo).toHaveBeenCalledOnce()
		expect(Object.keys(resolver.projections).sort()).toEqual([
			'$network',
			'$node',
			'alias',
			'connectionId',
			'lndPubkey',
		])
	})

	it('rejects a non-Lightning parent before provider transport', async () => {
		await expect(resolver.resolve[
			BlockheadLightningNodeStateSelector.ConnectionIdNetwork
		].resolve({
			connectionId: 'wrong-network',
			$network: {
				$network: {
					slug: 'bitcoin',
				},
			},
		}, context)).rejects.toThrow('unsupported Lightning network')
		expect(getInfo).not.toHaveBeenCalled()
	})
})
