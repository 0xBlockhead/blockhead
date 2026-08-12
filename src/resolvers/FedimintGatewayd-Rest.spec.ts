import {
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

const {
	getGatewayBalances,
	getGatewayId,
	getGatewayInfo,
	getPaymentSummary,
	listChannels,
	resolvedGatewayApiUrl,
} = vi.hoisted(() => ({
	getGatewayBalances: vi.fn(),
	getGatewayId: vi.fn(),
	getGatewayInfo: vi.fn(),
	getPaymentSummary: vi.fn(),
	listChannels: vi.fn(),
	resolvedGatewayApiUrl: vi.fn(() => 'http://127.0.0.1:8175'),
}))

vi.mock('$/sources/FedimintGatewayd/Rest/queries.ts', () => ({
	getGatewayBalances,
	getGatewayId,
	getGatewayInfo,
	getPaymentSummary,
	listChannels,
	resolvedGatewayApiUrl,
}))

const { default: fedimintGatewayd } = await import('$/resolvers/FedimintGatewayd-Rest.ts')

const gatewayResolver = fedimintGatewayd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FedimintGateway
	&& 'GatewayId' in resolver.resolve
))
const gatewayTimestampResolver = fedimintGatewayd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FedimintGateway_Timestamp
	&& 'GatewayTimestampMsSource' in resolver.resolve
))
const federationResolver = fedimintGatewayd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FedimintFederation
	&& 'FederationId' in resolver.resolve
))
const federationTimestampResolver = fedimintGatewayd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FedimintFederation_Timestamp
	&& 'FederationTimestampMsSource' in resolver.resolve
))

if (
	gatewayResolver == null
	|| !('GatewayId' in gatewayResolver.resolve)
	|| gatewayTimestampResolver == null
	|| !('GatewayTimestampMsSource' in gatewayTimestampResolver.resolve)
	|| federationResolver == null
	|| !('FederationId' in federationResolver.resolve)
	|| federationTimestampResolver == null
	|| !('FederationTimestampMsSource' in federationTimestampResolver.resolve)
)
	throw new Error('FedimintGatewayd-Rest spec missing resolvers')

const federation = {
	federation_id: 'fed-1',
	federation_name: 'Test Fed',
	balance_msat: 1_000,
	config: {
		invite_code: 'fed11invite',
		federation_index: 0,
		lightning_fee: {
			base: 1,
			parts_per_million: 2,
		},
		transaction_fee: {
			base: 0,
			parts_per_million: 0,
		},
	},
}

const info = {
	version_hash: 'deadbeef',
	federations: [federation],
	gateway_state: 'running',
	lightning_info: {
		connected: {
			public_key: '02pubkey',
			alias: 'gw-alias',
			network: 'bitcoin',
			block_height: 800_000,
			synced_to_chain: true,
		},
	},
	lightning_mode: {},
	registrations: {},
}

it('projects enrolled gateway identity leftovers from /info', async () => {
	getGatewayId.mockResolvedValue('02pubkey')
	getGatewayInfo.mockResolvedValue(info)

	const snapshot = await gatewayResolver.resolve.GatewayId.resolve({
		gatewayId: '02pubkey',
	}, {
		publicEnv: {},
		pagination: {
			limit: 50,
		},
	})

	expect(snapshot).toMatchObject({
		gatewayId: '02pubkey',
		apiUrl: 'http://127.0.0.1:8175',
		nodePubkey: '02pubkey',
	})
	expect(snapshot.$$federations).toEqual([{
		[EntityMetaKey.Selector]: {
			federationId: 'fed-1',
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FedimintFederation, [], 'name')]: 'Test Fed',
			[entityFieldAddressKey(EntityType.FedimintFederation, [], '$$gateways')]: [{
				[EntityMetaKey.Selector]: {
					gatewayId: '02pubkey',
				},
			}],
			[entityFieldAddressKey(EntityType.FedimintFederation, [], '$$timestamps')]: [
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						$federation: {
							federationId: 'fed-1',
						},
						source: Source.FedimintGatewayd_Rest,
					}),
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'reachable')]: true,
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'health')]: 'running',
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'gatewayCount')]: 1,
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'inviteCodeObserved')]: true,
					}),
				}),
			],
		},
	}])
	expect(snapshot.$$timestamps[0]?.[EntityMetaKey.Selector]).toMatchObject({
		$gateway: { gatewayId: '02pubkey' },
		source: Source.FedimintGatewayd_Rest,
	})
})

it('projects enrolled gateway observation leftovers including balances and channels', async () => {
	getGatewayId.mockResolvedValue('02pubkey')
	getGatewayInfo.mockResolvedValue(info)
	getGatewayBalances.mockResolvedValue({
		onchain_balance_sats: 4,
		lightning_balance_msats: 5,
		ecash_balances: [{
			federation_id: 'fed-1',
			ecash_balance_msats: 6,
		}],
		inbound_lightning_liquidity_msats: 7,
	})
	listChannels.mockResolvedValue([{
		remote_pubkey: '03peer',
		channel_size_sats: 100,
		outbound_liquidity_sats: 40,
		inbound_liquidity_sats: 60,
		is_active: true,
	}])
	getPaymentSummary.mockResolvedValue({
		outgoing: {
			total_fees: 0,
			total_success: 1,
			total_failure: 0,
		},
		incoming: {
			total_fees: 0,
			total_success: 0,
			total_failure: 0,
		},
	})

	expect(await gatewayTimestampResolver.resolve.GatewayTimestampMsSource.resolve({
		$gateway: { gatewayId: '02pubkey' },
		timestampMs: 1_000,
		source: Source.FedimintGatewayd_Rest,
	}, {
		publicEnv: {},
		pagination: { limit: 25 },
	})).toMatchObject({
		reachable: true,
		online: true,
		version: 'deadbeef',
		lightningAlias: 'gw-alias',
		federationsCount: 1,
		lightningBalanceMsat: 5n,
		ecashBalanceMsat: 6n,
		onchainBalanceSats: 4n,
	})
})

it('projects enrolled federation leftovers from gateway info', async () => {
	getGatewayId.mockResolvedValue('02pubkey')
	getGatewayInfo.mockResolvedValue(info)

	expect(await federationResolver.resolve.FederationId.resolve({
		federationId: 'fed-1',
	}, {
		publicEnv: {},
		pagination: { limit: 25 },
	})).toMatchObject({
		federationId: 'fed-1',
		name: 'Test Fed',
	})

	expect(await federationTimestampResolver.resolve.FederationTimestampMsSource.resolve({
		$federation: { federationId: 'fed-1' },
		timestampMs: 1_000,
		source: Source.FedimintGatewayd_Rest,
	}, {
		publicEnv: {},
		pagination: { limit: 25 },
	})).toMatchObject({
		reachable: true,
		health: 'running',
		gatewayCount: 1,
		inviteCodeObserved: true,
	})
})
