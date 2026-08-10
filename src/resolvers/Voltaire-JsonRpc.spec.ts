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

const getTxpoolStatus = vi.hoisted(() => vi.fn())
const getPeerCountObservation = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			10: [{
				diagnosticLabel: 'test execution endpoint',
				origin: 'https://optimism.example',
				getPeerCountObservation,
			}],
		},
		txpoolTransportsByChainId: {
			10: [{
				diagnosticLabel: 'test transport',
				getTxpoolStatus,
			}],
		},
	},
}))

const { default: voltaireJsonRpc } = await import('$/resolvers/Voltaire-JsonRpc.ts')

describe('Voltaire txpool observation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('publishes pending and queued counts on the canonical timestamp entity', async () => {
		getTxpoolStatus.mockResolvedValue({
			pending: '0x10',
			queued: '0x2',
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetwork_Txpool_Timestamp
		))
		if (resolver == null)
			throw new Error('Voltaire txpool resolver is not registered')

		const selector = {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '10',
				},
			},
			timestampMs: 1_784_221_554_477,
			source: Source.Voltaire_JsonRpc,
		} as const
		await expect(resolver.resolve.NetworkTimestampMsSource.resolve(selector, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).resolves.toEqual({
			[EntityMetaKey.Selector]: selector,
			pendingCount: 16,
			queuedCount: 2,
		})
	})
})

describe('Voltaire endpoint observation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes the current execution endpoint snapshot from Network', async () => {
		getPeerCountObservation.mockResolvedValue({
			peerCount: 17,
			fetchedAtMs: 1_785_477_600_123,
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire endpoint observation resolver is not registered')

		const observation = await resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(resolver.projections.$$endpointObservations(observation)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '10',
					},
				},
				endpointUrl: 'https://optimism.example',
				endpointKind: 'EvmExecutionJsonRpc',
				timestampMs: 1_785_477_600_123,
				source: Source.Voltaire_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Execution'], 'peerCount')]: 17n,
			},
		}])
		expect(voltaireJsonRpc.resolvers.some((candidate) => (
			candidate.entityType === EntityType.NetworkEndpointObservation_Timestamp
		))).toBe(false)
	})

	it('rejects the field when every execution endpoint fails', async () => {
		getPeerCountObservation.mockRejectedValue(new Error('peer count unavailable'))
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire endpoint observation resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).rejects.toThrow('all JSON-RPC endpoints failed for Network.$$endpointObservations')
	})
})
