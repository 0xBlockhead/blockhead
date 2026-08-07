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
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const { default: logosBlockchainNodeResolvers } = await import('$/resolvers/LogosBlockchainNode-Rest.ts')

const networkResolver = logosBlockchainNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LogosBlockchainNetwork
))!
const networkTimestampResolver = logosBlockchainNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LogosBlockchainNetwork_Timestamp
))!
const nodeStateResolver = logosBlockchainNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLogosBlockchainNodeState
))!
const nodeStateTimestampResolver = logosBlockchainNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLogosBlockchainNodeState_Timestamp
))!
const walletKeyStateResolver = logosBlockchainNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLogosBlockchainWalletKeyState
))!
const walletKeyStateTimestampResolver = logosBlockchainNodeResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp
))!

const network = {
	$network: {
		slug: 'logos-testnet',
	},
}
const peerId = '12D3KooWLogosPeer'
const connectionId = 'local-logos'
const nodeState = {
	connectionId,
	peerId,
}
const address = 'a'.repeat(64)
const publicKey = `0x${address}` as const
const walletKeyState = {
	$nodeState: nodeState,
	publicKey,
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

describe('Logos Blockchain node Rest deepen', () => {
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

		const snapshot = await networkResolver.resolve.Network.resolve(network, context)

		expect(networkResolver.projections.$$timestamps(snapshot, network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_785_556_800_000,
				source: Source.LogosBlockchainNode_Rest,
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
				source: Source.LogosBlockchainNode_Rest,
				target: {
					kind: 'NetworkSlug',
					key: 'logos-testnet',
				},
			}),
			'/cryptarchia/info'
		)
	})

	it('preserves the pre-start chain-service mode on NetworkTimestampMsSource', async () => {
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

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1,
			source: Source.LogosBlockchainNode_Rest,
		}, context)).resolves.toEqual({
			lib: `0x${lib}`,
			libSlot: 0n,
			tip: `0x${tip}`,
			slot: 0n,
			height: 0n,
			mode: 'AwaitingStart',
		})
	})

	it('rejects every network other than logos-testnet before transport', async () => {
		await expect(networkResolver.resolve.Network.resolve({
			$network: {
				slug: 'logos-mainnet',
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('projects enrolled BlockheadLogos node-state leftovers from /network/info', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_785_556_800_111)
		getJson.mockResolvedValue({
			listen_addresses: [
				'/ip4/127.0.0.1/tcp/3000',
			],
			peer_id: peerId,
			connected_peers: [
				'12D3KooWOther',
			],
			n_peers: 4,
			n_connections: 2,
			n_pending_connections: 1,
		})

		await expect(nodeStateResolver.resolve.ConnectionIdPeerId.resolve(nodeState, context)).resolves.toEqual({
			connectionId,
			peerId,
			endpoint: 'http://127.0.0.1:8080',
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$nodeState: nodeState,
						timestampMs: 1_785_556_800_111,
						source: Source.LogosBlockchainNode_Rest,
					},
				},
			],
		})

		await expect(nodeStateTimestampResolver.resolve.NodeStateTimestampMsSource.resolve({
			$nodeState: nodeState,
			timestampMs: 1,
			source: Source.LogosBlockchainNode_Rest,
		}, context)).resolves.toEqual({
			listenAddresses: [
				'/ip4/127.0.0.1/tcp/3000',
			],
			peerCount: 4,
			connectionCount: 2,
			pendingConnectionCount: 1,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				source: Source.LogosBlockchainNode_Rest,
			}),
			'/network/info'
		)
	})

	it('rejects node-state observations when peer ids diverge', async () => {
		getJson.mockResolvedValue({
			listen_addresses: [],
			peer_id: '12D3KooWOther',
			n_peers: 0,
			n_connections: 0,
			n_pending_connections: 0,
		})

		await expect(nodeStateResolver.resolve.ConnectionIdPeerId.resolve(nodeState, context)).rejects.toThrow('peer id mismatch')
	})

	it('projects enrolled BlockheadLogos wallet-key leftovers from /wallet/:public_key/balance', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_785_556_800_222)
		getJson.mockResolvedValue({
			tip,
			balance: 42,
			notes: {
				[`${'b'.repeat(64)}`]: 42,
			},
			address,
		})

		await expect(walletKeyStateResolver.resolve.NodeStatePublicKey.resolve(walletKeyState, context)).resolves.toEqual({
			$nodeState: {
				[EntityMetaKey.Selector]: nodeState,
			},
			publicKey,
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$walletKeyState: walletKeyState,
						timestampMs: 1_785_556_800_222,
						source: Source.LogosBlockchainNode_Rest,
					},
				},
			],
		})

		await expect(walletKeyStateTimestampResolver.resolve.WalletKeyStateTimestampMsSource.resolve({
			$walletKeyState: walletKeyState,
			timestampMs: 1,
			source: Source.LogosBlockchainNode_Rest,
		}, context)).resolves.toEqual({
			tip: `0x${tip}`,
			balance: 42n,
			address: publicKey,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				source: Source.LogosBlockchainNode_Rest,
			}),
			`/wallet/${address}/balance`
		)
	})

	it('does not freestyle wallet notes onto enrolled observations', async () => {
		getJson.mockResolvedValue({
			tip,
			balance: 7,
			notes: {
				[`${'c'.repeat(64)}`]: 7,
			},
			address,
		})

		const observation = await walletKeyStateTimestampResolver.resolve.WalletKeyStateTimestampMsSource.resolve({
			$walletKeyState: walletKeyState,
			timestampMs: 1,
			source: Source.LogosBlockchainNode_Rest,
		}, context)

		expect(observation).toEqual({
			tip: `0x${tip}`,
			balance: 7n,
			address: publicKey,
		})
		expect(observation).not.toHaveProperty('notes')
	})

	it('enrolls only Logos consensus + BlockheadLogos leftovers', () => {
		expect(logosBlockchainNodeResolvers.resolvers.map((resolver) => resolver.entityType).sort()).toEqual([
			EntityType.BlockheadLogosBlockchainNodeState,
			EntityType.BlockheadLogosBlockchainNodeState_Timestamp,
			EntityType.BlockheadLogosBlockchainWalletKeyState,
			EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp,
			EntityType.LogosBlockchainNetwork,
			EntityType.LogosBlockchainNetwork_Timestamp,
		].sort())
	})
})
