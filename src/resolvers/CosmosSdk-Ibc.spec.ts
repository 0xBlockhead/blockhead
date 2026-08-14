import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getIbcChannel = vi.hoisted(() => vi.fn())
const getIbcChannels = vi.hoisted(() => vi.fn())
const getIbcClientState = vi.hoisted(() => vi.fn())
const getIbcClientStates = vi.hoisted(() => vi.fn())
const getIbcClientConnections = vi.hoisted(() => vi.fn())
const getIbcConnection = vi.hoisted(() => vi.fn())
const getIbcConnections = vi.hoisted(() => vi.fn())
const getIbcConnectionChannels = vi.hoisted(() => vi.fn())
const getIbcDenomTrace = vi.hoisted(() => vi.fn())
const getIbcNextSequenceReceive = vi.hoisted(() => vi.fn())
const getIbcNextSequenceSend = vi.hoisted(() => vi.fn())
const getIbcPacketAcknowledgement = vi.hoisted(() => vi.fn())
const getIbcPacketCommitment = vi.hoisted(() => vi.fn())
const getIbcPacketReceipt = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CosmosSdk/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/CosmosSdk/Rest/queries.ts')>(),
	getIbcChannel,
	getIbcChannels,
	getIbcClientState,
	getIbcClientStates,
	getIbcClientConnections,
	getIbcConnection,
	getIbcConnections,
	getIbcConnectionChannels,
	getIbcDenomTrace,
	getIbcNextSequenceReceive,
	getIbcNextSequenceSend,
	getIbcPacketAcknowledgement,
	getIbcPacketCommitment,
	getIbcPacketReceipt,
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
	&& 'state' in resolver.projections
))
const ibcConnectionResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcConnection
	&& 'clientId' in resolver.projections
))
const ibcClientResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcClient
	&& 'clientType' in resolver.projections
))
const ibcDenomTraceResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcDenomTrace
))
const ibcPacketResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcPacket
	&& 'status' in resolver.projections
))
const ibcChannelsListResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$ibcChannels' in resolver.projections.Cosmos
	&& typeof resolver.projections.Cosmos.$$ibcChannels === 'object'
	&& resolver.projections.Cosmos.$$ibcChannels != null
	&& 'select' in resolver.projections.Cosmos.$$ibcChannels
))
const ibcClientsListResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$ibcClients' in resolver.projections.Cosmos
	&& typeof resolver.projections.Cosmos.$$ibcClients === 'object'
	&& resolver.projections.Cosmos.$$ibcClients != null
	&& 'select' in resolver.projections.Cosmos.$$ibcClients
))
const ibcConnectionsListResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cosmos' in resolver.projections
	&& '$$ibcConnections' in resolver.projections.Cosmos
	&& typeof resolver.projections.Cosmos.$$ibcConnections === 'object'
	&& resolver.projections.Cosmos.$$ibcConnections != null
	&& 'select' in resolver.projections.Cosmos.$$ibcConnections
))
const ibcConnectionChannelsResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcConnection
	&& '$$channels' in resolver.projections
	&& typeof resolver.projections.$$channels === 'object'
	&& 'select' in resolver.projections.$$channels
))
const ibcClientConnectionsResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcClient
	&& '$$connections' in resolver.projections
	&& typeof resolver.projections.$$connections === 'object'
	&& 'select' in resolver.projections.$$connections
))
const ibcClientChannelsResolver = cosmosSdk.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IbcClient
	&& '$$channels' in resolver.projections
	&& typeof resolver.projections.$$channels === 'object'
	&& 'select' in resolver.projections.$$channels
))

if (
	ibcChannelResolver == null
	|| ibcConnectionResolver == null
	|| ibcClientResolver == null
	|| ibcDenomTraceResolver == null
	|| ibcPacketResolver == null
	|| ibcChannelsListResolver == null
	|| ibcClientsListResolver == null
	|| ibcConnectionsListResolver == null
	|| ibcConnectionChannelsResolver == null
	|| ibcClientConnectionsResolver == null
	|| ibcClientChannelsResolver == null
)
	throw new Error('CosmosSdk IBC resolvers missing')

beforeEach(() => {
	getIbcChannel.mockReset()
	getIbcChannels.mockReset()
	getIbcClientState.mockReset()
	getIbcClientStates.mockReset()
	getIbcClientConnections.mockReset()
	getIbcConnection.mockReset()
	getIbcConnections.mockReset()
	getIbcConnectionChannels.mockReset()
	getIbcDenomTrace.mockReset()
	getIbcNextSequenceReceive.mockReset()
	getIbcNextSequenceSend.mockReset()
	getIbcPacketAcknowledgement.mockReset()
	getIbcPacketCommitment.mockReset()
	getIbcPacketReceipt.mockReset()
})

describe('CosmosSdk IBC resolvers', () => {
	it('projects exact source commitment state without inventing settlement', async () => {
		getIbcPacketCommitment.mockResolvedValue({
			commitment: 'AQID',
			proof: 'proof',
			proof_height: {
				revision_number: '4',
				revision_height: '22000000',
			},
		})

		const snapshot = await ibcPacketResolver.resolve.ChannelSequenceDirection.resolve({
			$channel: {
				$network: cosmosNetwork,
				portId: 'transfer',
				channelId: 'channel-141',
			},
			sequence: 42n,
			direction: 'source',
		}, context)

		expect(ibcPacketResolver.projections.sourcePort(snapshot)).toBe('transfer')
		expect(ibcPacketResolver.projections.sourceChannel(snapshot)).toBe('channel-141')
		expect(ibcPacketResolver.projections.commitmentHash(snapshot)).toBe('base64:AQID')
		expect(ibcPacketResolver.projections.status(snapshot)).toBe('committed')
		expect(getIbcPacketCommitment).toHaveBeenCalledWith({
			portId: 'transfer',
			channelId: 'channel-141',
			sequence: 42n,
		})
	})

	it('projects destination receipt and acknowledgement observations', async () => {
		getIbcPacketAcknowledgement.mockResolvedValue({
			acknowledgement: 'eyJyZXN1bHQiOiJBUUlkIn0=',
			proof: 'proof',
			proof_height: {
				revision_number: '1',
				revision_height: '20000000',
			},
		})
		getIbcPacketReceipt.mockResolvedValue({
			received: true,
			proof: 'proof',
			proof_height: {
				revision_number: '1',
				revision_height: '20000000',
			},
		})

		const snapshot = await ibcPacketResolver.resolve.ChannelSequenceDirection.resolve({
			$channel: {
				$network: cosmosNetwork,
				portId: 'transfer',
				channelId: 'channel-0',
			},
			sequence: 42n,
			direction: 'destination',
		}, context)

		expect(ibcPacketResolver.projections.destinationPort(snapshot)).toBe('transfer')
		expect(ibcPacketResolver.projections.destinationChannel(snapshot)).toBe('channel-0')
		expect(ibcPacketResolver.projections.receiptExists(snapshot)).toBe(true)
		expect(ibcPacketResolver.projections.status(snapshot)).toBe('acknowledgement-written')
	})

	it('preserves absent source commitment and rejects ambiguous direction labels', async () => {
		getIbcPacketCommitment.mockResolvedValue({
			commitment: '',
			proof: 'proof',
			proof_height: {
				revision_number: '4',
				revision_height: '22000000',
			},
		})
		const selector = {
			$channel: {
				$network: cosmosNetwork,
				portId: 'transfer',
				channelId: 'channel-141',
			},
			sequence: 42n,
			direction: 'source',
		}
		const snapshot = await ibcPacketResolver.resolve.ChannelSequenceDirection.resolve(selector, context)
		expect(ibcPacketResolver.projections.commitmentHash(snapshot)).toBeUndefined()
		expect(ibcPacketResolver.projections.status(snapshot)).toBe('commitment-absent')

		await expect(ibcPacketResolver.resolve.ChannelSequenceDirection.resolve({
			...selector,
			direction: 'send',
		}, context)).rejects.toThrow('invalid IBC packet direction send')
	})

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
		expect(ibcChannelResolver.projections.$counterpartyNetwork(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				caip2: networkBySlug.osmosis.caip2,
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

	it('lists Network.Cosmos IBC channels / clients / connections with resolveCount', async () => {
		getIbcChannels.mockResolvedValue({
			channels: [
				{
					state: 'STATE_OPEN',
					ordering: 'ORDER_UNORDERED',
					counterparty: {
						port_id: 'transfer',
						channel_id: 'channel-0',
					},
					connection_hops: [
						'connection-0',
					],
					version: 'ics20-1',
					port_id: 'transfer',
					channel_id: 'channel-141',
				},
			],
			pagination: {
				total: '42',
			},
		})
		getIbcClientStates.mockResolvedValue({
			client_states: [
				{
					client_id: '07-tendermint-1',
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
				},
			],
			pagination: {
				total: '7',
			},
		})
		getIbcConnections.mockResolvedValue({
			connections: [
				{
					id: 'connection-0',
					client_id: '07-tendermint-1',
					state: 'STATE_OPEN',
					counterparty: {
						client_id: '07-tendermint-0',
						connection_id: 'connection-0',
					},
					delay_period: '0',
				},
			],
			pagination: {
				total: '3',
			},
		})

		const channelsSnapshot = await ibcChannelsListResolver.resolve.Caip2.resolve(
			cosmosNetwork,
			{
				...context,
				pagination: {
					limit: 16,
				},
			}
		)
		expect(ibcChannelsListResolver.projections.Cosmos.$$ibcChannels.select(channelsSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					portId: 'transfer',
					channelId: 'channel-141',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.IbcChannel, [], '$connection')]: {
						[EntityMetaKey.Selector]: {
							$network: cosmosNetwork,
							connectionId: 'connection-0',
						},
					},
					[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyPortId')]: 'transfer',
					[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyChannelId')]: 'channel-0',
					[entityFieldAddressKey(EntityType.IbcChannel, [], 'ordering')]: 'ORDER_UNORDERED',
					[entityFieldAddressKey(EntityType.IbcChannel, [], 'version')]: 'ics20-1',
				},
			},
		])
		expect(ibcChannelsListResolver.projections.Cosmos.$$ibcChannels.resolveCount(channelsSnapshot)).toBe(42)

		const clientsSnapshot = await ibcClientsListResolver.resolve.Caip2.resolve(
			cosmosNetwork,
			{
				...context,
				pagination: {
					limit: 16,
				},
			}
		)
		expect(ibcClientsListResolver.projections.Cosmos.$$ibcClients.select(clientsSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					clientId: '07-tendermint-1',
				},
			},
		])
		expect(ibcClientsListResolver.projections.Cosmos.$$ibcClients.resolveCount(clientsSnapshot)).toBe(7)

		const connectionsSnapshot = await ibcConnectionsListResolver.resolve.Caip2.resolve(
			cosmosNetwork,
			{
				...context,
				pagination: {
					limit: 16,
				},
			}
		)
		expect(ibcConnectionsListResolver.projections.Cosmos.$$ibcConnections.select(connectionsSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					connectionId: 'connection-0',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.IbcConnection, [], 'clientId')]: '07-tendermint-1',
					[entityFieldAddressKey(EntityType.IbcConnection, [], '$client')]: {
						[EntityMetaKey.Selector]: {
							$network: cosmosNetwork,
							clientId: '07-tendermint-1',
						},
					},
					[entityFieldAddressKey(EntityType.IbcConnection, [], 'counterpartyClientId')]: '07-tendermint-0',
					[entityFieldAddressKey(EntityType.IbcConnection, [], 'counterpartyConnectionId')]: 'connection-0',
					[entityFieldAddressKey(EntityType.IbcConnection, [], 'delayPeriodNs')]: 0n,
				},
			},
		])
		expect(ibcConnectionsListResolver.projections.Cosmos.$$ibcConnections.resolveCount(connectionsSnapshot)).toBe(3)
	})

	it('projects IbcConnection.$$channels and IbcClient.$$connections / $$channels with resolveCount', async () => {
		getIbcConnectionChannels.mockResolvedValue({
			channels: [
				{
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
					port_id: 'transfer',
					channel_id: 'channel-141',
				},
			],
			pagination: {
				total: '5',
			},
		})
		getIbcClientConnections.mockResolvedValue({
			connection_paths: [
				'connections/connection-257',
				'connection-258',
			],
		})
		const expectedChannelRows = [{
			[EntityMetaKey.Selector]: {
				$network: cosmosNetwork,
				portId: 'transfer',
				channelId: 'channel-141',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.IbcChannel, [], '$connection')]: {
					[EntityMetaKey.Selector]: {
						$network: cosmosNetwork,
						connectionId: 'connection-257',
					},
				},
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyPortId')]: 'transfer',
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'counterpartyChannelId')]: 'channel-0',
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'ordering')]: 'ORDER_UNORDERED',
				[entityFieldAddressKey(EntityType.IbcChannel, [], 'version')]: 'ics20-1',
			},
		}]

		const connectionChannels = await ibcConnectionChannelsResolver.resolve.NetworkConnectionId.resolve({
			$network: cosmosNetwork,
			connectionId: 'connection-257',
		}, {
			...context,
			pagination: {
				limit: 16,
			},
		})
		expect(ibcConnectionChannelsResolver.projections.$$channels.select(connectionChannels)).toEqual(expectedChannelRows)
		expect(ibcConnectionChannelsResolver.projections.$$channels.resolveCount(connectionChannels)).toBe(5)

		const clientConnections = await ibcClientConnectionsResolver.resolve.NetworkClientId.resolve({
			$network: cosmosNetwork,
			clientId: '07-tendermint-259',
		}, context)
		expect(ibcClientConnectionsResolver.projections.$$connections.select(clientConnections)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					connectionId: 'connection-257',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: cosmosNetwork,
					connectionId: 'connection-258',
				},
			},
		])
		expect(ibcClientConnectionsResolver.projections.$$connections.resolveCount(clientConnections)).toBe(2)

		getIbcClientConnections.mockResolvedValue({
			connection_paths: [
				'connections/connection-257',
			],
		})
		const clientChannels = await ibcClientChannelsResolver.resolve.NetworkClientId.resolve({
			$network: cosmosNetwork,
			clientId: '07-tendermint-259',
		}, {
			...context,
			pagination: {
				limit: 16,
			},
		})
		expect(ibcClientChannelsResolver.projections.$$channels.select(clientChannels)).toEqual(expectedChannelRows)
		expect(ibcClientChannelsResolver.projections.$$channels.resolveCount(clientChannels)).toBe(5)
		expect(getIbcConnectionChannels).toHaveBeenCalledWith({
			connectionId: 'connection-257',
			limit: 16,
		})
	})
})
