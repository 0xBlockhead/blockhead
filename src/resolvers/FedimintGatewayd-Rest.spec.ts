import {
	afterEach,
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

afterEach(() => {
	vi.restoreAllMocks()
})

const { default: fedimintGatewayd } = await import('$/resolvers/FedimintGatewayd-Rest.ts')

const gatewayResolver = fedimintGatewayd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FedimintGateway
	&& 'GatewayId' in resolver.resolve
))
const federationResolver = fedimintGatewayd.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FedimintFederation
	&& 'FederationId' in resolver.resolve
))

if (
	gatewayResolver == null
	|| !('GatewayId' in gatewayResolver.resolve)
	|| federationResolver == null
	|| !('FederationId' in federationResolver.resolve)
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

const balances = {
	onchain_balance_sats: 4,
	lightning_balance_msats: 5,
	ecash_balances: [{
		federation_id: 'fed-1',
		ecash_balance_msats: 6,
	}],
	inbound_lightning_liquidity_msats: 7,
}

const channels = [{
	remote_pubkey: '03peer',
	channel_size_sats: 100,
	outbound_liquidity_sats: 40,
	inbound_liquidity_sats: 60,
	is_active: true,
}]

const paymentSummary = {
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
}

const publicEnv = {
	FEDIMINT_GATEWAYD_PASSWORD: 'secret-password',
}

const mockGatewayObservation = () => {
	getGatewayId.mockResolvedValue('02pubkey')
	getGatewayInfo.mockResolvedValue(info)
	getGatewayBalances.mockResolvedValue(balances)
	listChannels.mockResolvedValue(channels)
	getPaymentSummary.mockResolvedValue(paymentSummary)
}

it('projects enrolled gateway identity and current observation leftovers from one coherent read', async () => {
	const timestampMs = 1_700_000_000_000
	vi.spyOn(Date, 'now').mockReturnValue(timestampMs)
	mockGatewayObservation()

	const snapshot = await gatewayResolver.resolve.GatewayId.resolve({
		gatewayId: '02pubkey',
	}, {
		publicEnv,
		pagination: {
			limit: 50,
		},
	})

	expect(snapshot).toMatchObject({
		gatewayId: '02pubkey',
		apiUrl: 'http://127.0.0.1:8175',
		nodePubkey: '02pubkey',
	})
	expect(snapshot).not.toHaveProperty('publicEnv')
	expect(snapshot).not.toHaveProperty('FEDIMINT_GATEWAYD_PASSWORD')
	expect(getPaymentSummary).toHaveBeenCalledWith({
		endMs: timestampMs,
		publicEnv,
		startMs: timestampMs - 30 * 24 * 60 * 60 * 1000,
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
					[EntityMetaKey.Selector]: {
						$federation: {
							federationId: 'fed-1',
						},
						timestampMs,
						source: Source.FedimintGatewayd_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'reachable')]: true,
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'health')]: 'running',
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'gatewayCount')]: 1,
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'inviteCodeObserved')]: true,
						[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'metaJson')]: JSON.stringify({
							federationIndex: 0,
							balanceMsat: 1_000,
						}),
					},
				}),
			],
		},
	}])
	expect(snapshot.$$timestamps).toEqual([{
		[EntityMetaKey.Selector]: {
			$gateway: { gatewayId: '02pubkey' },
			timestampMs,
			source: Source.FedimintGatewayd_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'reachable')]: true,
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'online')]: true,
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'version')]: 'deadbeef',
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'lightningAlias')]: 'gw-alias',
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'routingFeesJson')]: JSON.stringify([{
				federationId: 'fed-1',
				lightningFee: {
					base: 1,
					parts_per_million: 2,
				},
				transactionFee: {
					base: 0,
					parts_per_million: 0,
				},
			}]),
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'federationsCount')]: 1,
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'lightningBalanceMsat')]: 5n,
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'ecashBalanceMsat')]: 6n,
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'onchainBalanceSats')]: 4n,
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'channelsJson')]: JSON.stringify(channels),
			[entityFieldAddressKey(EntityType.FedimintGateway_Timestamp, [], 'paymentSummaryJson')]: JSON.stringify(paymentSummary),
		},
	}])
})

it('projects enrolled federation leftovers from current gateway info', async () => {
	const timestampMs = 1_700_000_000_000
	vi.spyOn(Date, 'now').mockReturnValue(timestampMs)
	getGatewayId.mockResolvedValue('02pubkey')
	getGatewayInfo.mockResolvedValue(info)

	const snapshot = await federationResolver.resolve.FederationId.resolve({
		federationId: 'fed-1',
	}, {
		publicEnv,
		pagination: { limit: 25 },
	})

	expect(snapshot).toMatchObject({
		federationId: 'fed-1',
		name: 'Test Fed',
	})
	expect(snapshot).not.toHaveProperty('publicEnv')
	expect(snapshot).not.toHaveProperty('FEDIMINT_GATEWAYD_PASSWORD')
	expect(snapshot.$$timestamps).toEqual([{
		[EntityMetaKey.Selector]: {
			$federation: { federationId: 'fed-1' },
			timestampMs,
			source: Source.FedimintGatewayd_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'reachable')]: true,
			[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'health')]: 'running',
			[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'gatewayCount')]: 1,
			[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'inviteCodeObserved')]: true,
			[entityFieldAddressKey(EntityType.FedimintFederation_Timestamp, [], 'metaJson')]: JSON.stringify({
				federationIndex: 0,
				balanceMsat: 1_000,
			}),
		},
	}])
})

it('does not replay current gateway or federation observations at an arbitrary timestamp', () => {
	expect(fedimintGatewayd.resolvers.some((resolver) => (
		resolver.entityType === EntityType.FedimintGateway_Timestamp
		|| resolver.entityType === EntityType.FedimintFederation_Timestamp
	))).toBe(false)
})
