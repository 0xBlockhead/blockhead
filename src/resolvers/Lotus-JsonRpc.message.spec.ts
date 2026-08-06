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
import { Source } from '$/sources/Source.ts'

const getMessage = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Lotus/JsonRpc/queries.ts', () => ({
	getMessage,
}))

const { default: lotusJsonRpc } = await import('$/resolvers/Lotus-JsonRpc.ts')

const messageResolver = lotusJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMessage
))

if (messageResolver == null)
	throw new Error('Lotus-JsonRpc spec missing FilecoinMessage resolver')

const network = {
	slug: networkBySlug.filecoin.slug,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [Source.Lotus_JsonRpc],
	publicEnv: {},
}

describe('Lotus JsonRpc FilecoinMessage', () => {
	beforeEach(() => {
		getMessage.mockReset()
	})

	it('maps ChainGetMessage into FilecoinMessage fields', async () => {
		getMessage.mockResolvedValueOnce({
			Version: 0,
			To: 'f1to',
			From: 'f1from',
			Nonce: 7,
			Value: '1000',
			GasLimit: 50_000_000,
			GasFeeCap: '100',
			GasPremium: '10',
			Method: 2,
			Params: '',
		})
		const snapshot = await messageResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafyMessage',
		}, context)
		expect(snapshot).toEqual({
			$from: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: 'f1from',
				},
			},
			$to: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: 'f1to',
				},
			},
			method: 2,
			nonce: 7n,
			valueAttoFil: 1000n,
			gasLimit: 50_000_000n,
		})
		expect(getMessage).toHaveBeenCalledWith({
			messageCid: 'bafyMessage',
		})
	})
})
