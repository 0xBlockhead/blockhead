import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const { default: logosBlockchainNodeResolvers } = await import('$/resolvers/LogosBlockchainNode-Rest.ts')

const resolver = logosBlockchainNodeResolvers.resolvers[0]
const network = {
	$network: {
		slug: 'logos-testnet',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const lib = '2'.repeat(64)
const tip = '3'.repeat(64)

describe('Logos Blockchain node consensus resolver', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		getJson.mockReset()
	})

	it('materializes one exact source-provenanced consensus observation from one fetch', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_785_556_800_000)
		getJson.mockResolvedValue({
			cryptarchia_info: {
				lib,
				lib_slot: 80_000,
				tip,
				slot: 100_000,
				height: 500,
			},
			mode: {
				Started: 'Bootstrapping',
			},
		})

		const timestamps = await resolver.resolve.Network.resolve(network, context)

		expect(resolver.projections.$$timestamps(timestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_785_556_800_000,
				source: 'LogosBlockchainNode_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'lib')]: `0x${lib}`,
				[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'libSlot')]: 80_000n,
				[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'tip')]: `0x${tip}`,
				[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'slot')]: 100_000n,
				[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'height')]: 500n,
				[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'mode')]: 'Bootstrapping',
			},
		}])
		expect(getJson).toHaveBeenCalledTimes(1)
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				source: 'LogosBlockchainNode_Rest',
				target: {
					kind: 'NetworkSlug',
					key: 'logos-testnet',
				},
			}),
			'/cryptarchia/info'
		)
		expect(logosBlockchainNodeResolvers.resolvers).toHaveLength(1)
	})

	it('preserves the pre-start chain-service mode', async () => {
		getJson.mockResolvedValue({
			cryptarchia_info: {
				lib,
				lib_slot: 0,
				tip,
				slot: 0,
				height: 0,
			},
			mode: 'AwaitingStart',
		})

		const timestamps = await resolver.resolve.Network.resolve(network, context)

		expect(timestamps[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'mode')
		]).toBe('AwaitingStart')
	})

	it('rejects every network other than logos-testnet before transport', async () => {
		await expect(resolver.resolve.Network.resolve({
			$network: {
				slug: 'logos-mainnet',
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})
})
