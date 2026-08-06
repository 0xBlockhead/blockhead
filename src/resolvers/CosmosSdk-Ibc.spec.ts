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

const getIbcChannel = vi.hoisted(() => vi.fn())
const getIbcClientState = vi.hoisted(() => vi.fn())
const getIbcConnection = vi.hoisted(() => vi.fn())
const getIbcDenomTrace = vi.hoisted(() => vi.fn())
const getIbcNextSequenceReceive = vi.hoisted(() => vi.fn())
const getIbcNextSequenceSend = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CosmosSdk/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/CosmosSdk/Rest/queries.ts')>(),
	getIbcChannel,
	getIbcClientState,
	getIbcConnection,
	getIbcDenomTrace,
	getIbcNextSequenceReceive,
	getIbcNextSequenceSend,
}))

const { default: cosmosSdk } = await import('$/resolvers/CosmosSdk-Rest.ts')

const cosmosNetwork = {
	caip2: networkBySlug.cosmos.caip2,
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

const ibcChannelResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcChannel
))
const ibcConnectionResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcConnection
))
const ibcClientResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcClient
))
const ibcDenomTraceResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcDenomTrace
))

if (
	ibcChannelResolver == null
	|| ibcConnectionResolver == null
	|| ibcClientResolver == null
	|| ibcDenomTraceResolver == null
)
	throw new Error('CosmosSdk IBC resolvers missing')

beforeEach(() => {
	getIbcChannel.mockReset()
	getIbcClientState.mockReset()
	getIbcConnection.mockReset()
	getIbcDenomTrace.mockReset()
	getIbcNextSequenceReceive.mockReset()
	getIbcNextSequenceSend.mockReset()
})

describe('CosmosSdk IBC resolvers', () => {
	it('projects an IBC channel with connection/client hops and sequences', async () => {
		getIbcChannel.mockResolvedValue({
			channel: {
				state: 'STATE_OPEN',
				ordering: 'ORDER_UNORDERED',
				counterparty: {
					port_id: 'transfer',
					channel_id: 'channel-0',
				},
				connection_hops: [
					'connection-257',
				],
				version: 'ics20-1',
			},
		})
		getIbcConnection.mockResolvedValue({
			connection: {
				client_id: '07-tendermint-259',
				state: 'STATE_OPEN',
				counterparty: {
					client_id: '07-tendermint-0',
					connection_id: 'connection-0',
				},
				delay_period: '0',
			},
		})
		getIbcClientState.mockResolvedValue({
			client_state: {
				'@type': '/ibc.lightclients.tendermint.v1.ClientState',
				chain_id: 'osmosis-1',
				trust_level: {
					numerator: '1',
					denominator: '3',
				},
				trusting_period: '1209600s',
				unbonding_period: '1814400s',
				max_clock_drift: '600s',
				frozen_height: {
					revision_number: '0',
					revision_height: '0',
				},
				latest_height: {
					revision_number: '1',
					revision_height: '9',
				},
			},
		})
		getIbcNextSequenceSend.mockResolvedValue({
			next_sequence_send: '4969230',
		})
		getIbcNextSequenceReceive.mockResolvedValue({
			next_sequence_receive: '0',
		})

		const snapshot = await ibcChannelResolver.resolve.NetworkPortIdChannelId.resolve({
			$network: cosmosNetwork,
			portId: 'transfer',
			channelId: 'channel-141',
		}, context)

		expect(ibcChannelResolver.projections.state(snapshot)).toBe('STATE_OPEN')
		expect(ibcChannelResolver.projections.ordering(snapshot)).toBe('ORDER_UNORDERED')
		expect(ibcChannelResolver.projections.version(snapshot)).toBe('ics20-1')
		expect(ibcChannelResolver.projections.counterpartyChainId(snapshot)).toBe('osmosis-1')
		expect(ibcChannelResolver.projections.counterpartyPortId(snapshot)).toBe('transfer')
		expect(ibcChannelResolver.projections.counterpartyChannelId(snapshot)).toBe('channel-0')
		expect(ibcChannelResolver.projections.nextSequenceSend(snapshot)).toBe(4969230n)
		expect(ibcChannelResolver.projections.nextSequenceReceive(snapshot)).toBe(0n)
		expect(ibcChannelResolver.projections.$connection(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: cosmosNetwork,
				connectionId: 'connection-257',
			},
		})
		expect(ibcChannelResolver.projections.$client(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: cosmosNetwork,
				clientId: '07-tendermint-259',
			},
		})
	})

	it('projects an IBC connection and tendermint client state', async () => {
		getIbcConnection.mockResolvedValue({
			connection: {
				client_id: '07-tendermint-1',
				state: 'STATE_OPEN',
				counterparty: {
					client_id: '07-tendermint-0',
					connection_id: 'connection-0',
				},
				delay_period: '1000',
			},
		})
		getIbcClientState.mockResolvedValue({
			client_state: {
				'@type': '/ibc.lightclients.tendermint.v1.ClientState',
				chain_id: 'irishub-1',
				trust_level: {
					numerator: '1',
					denominator: '3',
				},
				trusting_period: '1209600s',
				unbonding_period: '1814400.5s',
				max_clock_drift: '600s',
				frozen_height: {
					revision_number: '0',
					revision_height: '0',
				},
				latest_height: {
					revision_number: '1',
					revision_height: '9147329',
				},
			},
		})

		const connection = await ibcConnectionResolver.resolve.NetworkConnectionId.resolve({
			$network: cosmosNetwork,
			connectionId: 'connection-0',
		}, context)
		expect(ibcConnectionResolver.projections.clientId(connection)).toBe('07-tendermint-1')
		expect(ibcConnectionResolver.projections.delayPeriodNs(connection)).toBe(1000n)
		expect(ibcConnectionResolver.projections.counterpartyConnectionId(connection)).toBe('connection-0')

		const client = await ibcClientResolver.resolve.NetworkClientId.resolve({
			$network: cosmosNetwork,
			clientId: '07-tendermint-1',
		}, context)
		expect(ibcClientResolver.projections.clientType(client)).toBe('07-tendermint')
		expect(ibcClientResolver.projections.trustLevel(client)).toBe('1/3')
		expect(ibcClientResolver.projections.counterpartyChainId(client)).toBe('irishub-1')
		expect(ibcClientResolver.projections.trustingPeriodNs(client)).toBe(1209600n * 1_000_000_000n)
		expect(ibcClientResolver.projections.unbondingPeriodNs(client)).toBe(
			1814400n * 1_000_000_000n + 500_000_000n
		)
		expect(ibcClientResolver.projections.maxClockDriftNs(client)).toBe(600n * 1_000_000_000n)
		expect(ibcClientResolver.projections.latestHeight(client)).toEqual({
			revision_number: '1',
			revision_height: '9147329',
		})
	})

	it('projects an IBC denom trace with channel + cosmos denom refs', async () => {
		getIbcDenomTrace.mockResolvedValue({
			denom_trace: {
				path: 'transfer/channel-141',
				base_denom: 'uosmo',
			},
		})

		const snapshot = await ibcDenomTraceResolver.resolve.NetworkTraceKey.resolve({
			$network: cosmosNetwork,
			traceKey: `ibc/${'ab'.repeat(32)}`,
		}, context)

		expect(ibcDenomTraceResolver.projections.path(snapshot)).toBe('transfer/channel-141')
		expect(ibcDenomTraceResolver.projections.baseDenom(snapshot)).toBe('uosmo')
		expect(ibcDenomTraceResolver.projections.denomHash(snapshot)).toBe('ab'.repeat(32))
		expect(ibcDenomTraceResolver.projections.$channel(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: cosmosNetwork,
				portId: 'transfer',
				channelId: 'channel-141',
			},
		})
		expect(ibcDenomTraceResolver.projections.$cosmosDenom(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: cosmosNetwork,
				denom: `ibc/${'AB'.repeat(32)}`,
			},
		})
	})

	it('rejects non-cosmos networks before IBC transport', async () => {
		await expect(ibcChannelResolver.resolve.NetworkPortIdChannelId.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			portId: 'transfer',
			channelId: 'channel-0',
		}, context)).rejects.toThrow('unsupported network')
		expect(getIbcChannel).not.toHaveBeenCalled()
	})
})
