import { describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getTxpoolStatus = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
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
